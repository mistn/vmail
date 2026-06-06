export default function Notifications({}: {}) {
  return (
    <div className="w-full bg-white text-sm text-gray-600 shadow-none px-2 py-1.5 text-center z-50 border-b border-dashed border-gray-300">
      <p className="">
        🎉 WR.DO Beta Launching Now!{" "}
        <a
          target="_blank"
          className="text-blue-500 ml-2 underline after:content-['_↗']"
          href="https://wr.do">
          Try it
        </a>
      </p>
    </div>
  );
}
