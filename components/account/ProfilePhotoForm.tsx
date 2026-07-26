import Image from "next/image";
import { Camera, UserRound } from "lucide-react";

interface ProfilePhotoFormProps {
  name: string;
  hasPhoto: boolean;
  updatedAt: Date | null;
  message?: string;
}

export default function ProfilePhotoForm({
  name,
  hasPhoto,
  updatedAt,
  message,
}: ProfilePhotoFormProps) {
  const photoUrl = `/api/profile/photo?v=${updatedAt?.getTime() ?? 0}`;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
          {hasPhoto ? (
            <Image
              src={photoUrl}
              alt={`${name} profile`}
              width={112}
              height={112}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound className="h-12 w-12 text-slate-600" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white">Profile photo</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Upload a clear photo of your face. JPG, PNG, or WebP up to 5 MB;
            it will be cropped and resized securely.
          </p>
          {message && <p className="mt-2 text-sm text-amber-300">{message}</p>}
          <form
            action="/api/profile/photo"
            method="post"
            encType="multipart/form-data"
            className="mt-4 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp"
              required
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:font-semibold file:text-white"
            />
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-500">
              <Camera className="h-4 w-4" />
              Upload photo
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
