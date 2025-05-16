"use client";

import { CardBody, CardContainer, CardItem } from "./3d-card";
import Shirt from "./tshirt.png";
export function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50/30 backdrop-blur-md backdrop-filter relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black/30 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[40rem] h-fit rounded-xl p-6 border">
     
       
        <CardItem translateZ="100" className="w-full flex justify-center items-center mt-4">
          <img
            src={Shirt}
            height="1200"
            width="1200"
            className="h-[60vh] w-[40vw] object-contain rounded-xl group-hover/card:shadow-xl mx-auto"
            alt="thumbnail"
          />
        </CardItem>
    
      </CardBody>
    </CardContainer>
  );
}
