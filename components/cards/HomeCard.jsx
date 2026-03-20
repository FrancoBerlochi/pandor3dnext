const HomeCard = ({icon, tittle, text }) =>
{ 
  return (
    <div className="flex flex-col w-[20vw] gap-8   bg-blue-50 py-6 px-6 rounded-2xl shadow-2xs  max-md:w-[80vw]"> 
      <div className="w-10 h-10 bg-sky-100 dark:bg-[hsl(41,98%,75%)] items-center flex justify-center rounded-xl max-md:w-12 max-md:h-12">
        {icon}
      </div>
      <p className="text-xl font-bold dark:text-white max-md:text-2xl">
        {tittle}
      </p>
      <p className="text-gray-700 dark:text-gray-300 max-md:text-[1.1rem]">{text}</p>
    </div>
  );

}

export default HomeCard;