const PanelSkeleton = () => {
  return (
    <div className="flex w-full mx-auto overflow-hidden bg-white rounded-lg shadow-lg animate-pulse">
      <div className="w-1/4 justify-items-center content-center">
        <div className="h-3/5 w-3/5 rounded-full bg-gray-300"></div>
      </div>

      <div className="w-3/4 p-4 md:p-4">
        <h1 className="h-4 bg-gray-200 rounded-lg w-28"></h1>
        <div className="flex justify-between mt-6 items-center">
          <p className="w-40 h-3  bg-gray-200 rounded-lg"></p>
          <h1 className="w-10 h-2 bg-gray-200 rounded-lg"></h1>
        </div>
      </div>
    </div>
  );
};

export default PanelSkeleton;
