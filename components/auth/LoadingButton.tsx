interface LoadingButtonProps {
  text: string;
  loading?: boolean;
}

export default function LoadingButton({
  text,
  loading = false,
}: LoadingButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Please wait..." : text}
    </button>
  );
}