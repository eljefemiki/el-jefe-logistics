"use client";

import Button from "@/components/ui/Button";

interface Props {
  saving?: boolean;
}

export default function FormActions({
  saving = false,
}: Props) {
  return (
    <div className="flex justify-end gap-4 pt-8">

      <Button
        variant="secondary"
        type="button"
      >
        Cancel
      </Button>

      <Button type="submit">
        {saving ? "Saving..." : "Save Truck"}
      </Button>

    </div>
  );
}