"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type Product = {
  id: string;
  title: string;
  image_url: string | null;
  badge_label: string | null;
  product_categories: { name: string } | { name: string }[] | null;
};

function getCategoryName(cat: Product["product_categories"]): string | null {
  if (!cat) return null;
  if (Array.isArray(cat)) return cat[0]?.name ?? null;
  return cat.name;
}

const SwiperComponent = ({ data }: { data: Product[] }) => {
  return (
    <Swiper
      slidesPerView={1.2}
      spaceBetween={16}
      breakpoints={{
        640: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3 },
      }}
      className="mySwiper w-full"
    >
      {data.map((s) => (
        <SwiperSlide key={s.id}>
          <div className="rounded-2xl overflow-hidden bg-sky-400 dark:bg-neutral-900 group cursor-pointer">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {s.badge_label && (
                <div className="absolute top-3 left-3 z-10 bg-sky-400 text-white dark:bg-amber-400 dark:text-amber-900 text-[10px] font-semibold px-2 py-1 rounded-md tracking-wide uppercase">
                  {s.badge_label}
                </div>
              )}
              {s.image_url ? (
                <img
                  src={s.image_url}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800" />
              )}
            </div>
            <div className="p-4">
              {getCategoryName(s.product_categories) && (
                <p className="text-cyan-950 dark:text-amber-400 text-[11px] font-semibold tracking-widest uppercase mb-1">
                  {getCategoryName(s.product_categories)}
                </p>
              )}
              <h3 className="text-white tracking-wider text-lg dark:font-semibold leading-tight">
                {s.title}
              </h3>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperComponent;
