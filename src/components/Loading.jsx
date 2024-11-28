// import react from 'react';

function Loading() {
  return (
    <div key={Math.random()} className="flex gap-2 w-fit p-2 ">
      <div className="flex items-center space-x-2">
        {/* Punto 1 */}
        <span className="block w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></span>
        {/* Punto 2 */}
        <span className="block w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
        {/* Punto 3 */}
        <span className="block w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-400"></span>
      </div>
    </div>
  );
}

export default Loading;
