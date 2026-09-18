import BarLoader from "@/components/BarLoader";

export default function Loading() {
  return (
    <div className="relative flex min-h-[40vh] flex-1 items-start justify-center bg-transparent pt-0">
      <BarLoader size="lg" className="w-full max-w-none rounded-none" />
    </div>
  );
}
