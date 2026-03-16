const HomeCard = ({icon, tittle, text }) =>
{ 
  return (
    <div className="flex flex-col w-[20vw] gap-8 border-2 border-gray-200 py-6 px-6 rounded-2xl shadow-2xs hover:border-cyan-200 dark:border-[#666] dark:hover:border-[hsl(41,98%,65%)] max-md:w-[80vw] max-md:dark:border-[hsl(41,98%,65%)]">
      <div className="w-10 h-10 bg-cyan-100 dark:bg-[hsl(41,98%,75%)] items-center flex justify-center rounded-xl max-md:w-12 max-md:h-12">
        {icon}
      </div>
      <h3 className="text-xl font-semibold dark:text-white max-md:text-2xl">
        {tittle}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 max-md:text-[1.1rem]">{text}</p>
    </div>
  );

}

export default HomeCard;