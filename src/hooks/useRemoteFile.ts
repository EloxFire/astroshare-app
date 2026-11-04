import { Directory, File, Paths } from "expo-file-system";
import { useCallback, useEffect, useMemo, useState } from "react";

export type RemoteFileStatus = "checking" | "missing" | "downloading" | "ready" | "error";

interface UseRemoteFileOptions {
  // Optionnels : permet d'appeler ce hook sans condition (règle des hooks) même quand l'appelant
  // ne sait pas encore s'il y a un fichier à télécharger (ex: modèle sans modelUrl). Le hook reste
  // alors inerte (status "checking", download()/remove() sans effet) sans accéder au système de
  // fichiers avec un chemin vide.
  url?: string;
  // Chemin relatif au dossier "documents" de l'app, ex: "3d-models/moon-v1.glb"
  localPath?: string;
}

interface UseRemoteFileResult {
  status: RemoteFileStatus;
  progress: number; // 0 à 1, valable seulement pendant le téléchargement
  remoteSizeBytes: number | null; // taille du fichier distant (lue via HEAD), null si inconnue
  localUri: string | null; // uri du fichier local, disponible une fois "ready"
  download: () => void;
  remove: () => void;
}

// Hook générique : télécharge un fichier distant une seule fois puis le garde en cache local
// (dossier documents de l'app, donc disponible hors ligne par la suite). Volontairement
// générique - il ne connaît que l'URL et le chemin local, rien de spécifique au contenu
// téléchargé - pour être réutilisable par n'importe quel futur module (modèles 3D, cartes
// hors ligne, etc.), pas seulement le visualiseur 3D.
export function useRemoteFile({ url, localPath }: UseRemoteFileOptions): UseRemoteFileResult {
  const file = useMemo(() => (localPath ? new File(Paths.document, localPath) : null), [localPath]);

  const [status, setStatus] = useState<RemoteFileStatus>(() => (file?.exists ? "ready" : "checking"));
  const [progress, setProgress] = useState(0);
  const [remoteSizeBytes, setRemoteSizeBytes] = useState<number | null>(null);

  useEffect(() => {
    if (!file || !url) return;

    if (file.exists) {
      setStatus("ready");
      return;
    }

    setStatus("missing");

    // Taille du fichier distant, pour l'afficher avant de lancer le téléchargement. Best-effort :
    // si le serveur ne répond pas ou ne renvoie pas Content-Length, le bouton de téléchargement
    // s'affiche simplement sans taille.
    fetch(url, { method: "HEAD" })
      .then((response) => {
        const contentLength = response.headers.get("content-length");
        setRemoteSizeBytes(contentLength ? Number(contentLength) : null);
      })
      .catch(() => setRemoteSizeBytes(null));
  }, [file, url]);

  const download = useCallback(() => {
    if (!file || !url) return;

    const directory = file.parentDirectory;
    if (!directory.exists) {
      directory.create({ intermediates: true });
    }

    // Téléchargement vers un fichier temporaire, déplacé vers sa destination finale seulement en
    // cas de succès : un échec en cours de route ne laisse jamais un fichier incomplet à la place
    // du fichier attendu.
    const tmpFile = new File(directory, `${file.name}.tmp`);
    if (tmpFile.exists) {
      tmpFile.delete();
    }

    setStatus("downloading");
    setProgress(0);

    const task = File.createDownloadTask(url, tmpFile, {
      onProgress: ({ bytesWritten, totalBytes }) => {
        if (totalBytes > 0) {
          setProgress(bytesWritten / totalBytes);
        }
      },
    });

    task.downloadAsync()
      .then((downloadedFile) => {
        if (!downloadedFile) {
          throw new Error("Téléchargement interrompu");
        }
        downloadedFile.moveSync(file, { overwrite: true });
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [file, url]);

  const remove = useCallback(() => {
    if (!file) return;

    if (file.exists) {
      file.delete();
    }
    setStatus("missing");
    setProgress(0);
  }, [file]);

  return {
    status,
    progress,
    remoteSizeBytes,
    localUri: status === "ready" && file ? file.uri : null,
    download,
    remove,
  };
}
