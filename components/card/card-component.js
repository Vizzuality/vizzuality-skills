import React from "react";
import { Frame, useAnimation, transform } from "framer";
import styles from "./card.module.scss";

const normalShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
const cardWidth = 300;
const cardHeight = cardWidth + 100;

const images = {
  'Javi Abia': 'https://www.vizzuality.com/wp-content/uploads/2019/01/javier-abia-340x340.jpg',
  'Álvaro Leal': 'https://www.vizzuality.com/wp-content/uploads/2019/01/alvaro-leal-340x340.jpg',
  'Pablo Pareja Tobes': 'https://www.vizzuality.com/wp-content/uploads/2019/01/pablo-pareja-340x340.jpg',
  'Clément': 'https://www.vizzuality.com/wp-content/uploads/2019/01/Clement-340x340.jpg',
  'Tomas': 'https://www.vizzuality.com/wp-content/uploads/2019/01/tomas-340x340.jpg',
  'Andrés González': 'https://www.vizzuality.com/wp-content/uploads/2019/01/andres-340x340.jpg',
  'Miguel Barrenechea': 'https://www.vizzuality.com/wp-content/uploads/2019/01/Miguel-340x340.jpg',
  'Ana Montiaga': 'https://www.vizzuality.com/wp-content/uploads/2021/08/2-1-340x340.png',
  'María': 'https://www.vizzuality.com/wp-content/uploads/2019/01/maria-luena-340x340.jpg',
  'David Inga': 'https://www.vizzuality.com/wp-content/uploads/2019/01/d-inga-340x340.jpg'
}

export default function Card({ dev, className }) {

  const style = {
    backgroundImage: `url(${images[dev]})`,
    backgroundSize: "contain",
    backgroundColor: "rgba(155, 255, 200, 0.1)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    boxShadow: normalShadow,
    border: "15px solid white"
  };

  const anim = useAnimation();
  return (
    <div className={className}>
      <Frame
        perspective={800}
        center
        width={cardWidth}
        height={cardHeight}
        background="transparent"
      >
        <Frame
          style={style}
          animate={anim}
          width={cardWidth}
          height={cardHeight}
          borderRadius={20}
          onMouseMove={function(e) {
            const { clientX, clientY } = e;
            const offsetXFromCenter = clientX - window.innerWidth / 2;
            const offsetYFromCenter = clientY - window.innerHeight / 2;
            const shadowx = transform(
              offsetXFromCenter,
              [-250, 0, 250],
              [25, 0, -25]
            );
            const shadowy = transform(
              offsetYFromCenter,
              [-150, 0, 150],
              [25, 0, -25]
            );

            anim.start({
              rotateX: -offsetYFromCenter / 20,
              rotateY: offsetXFromCenter / 20,
              scale: 1.1,
              boxShadow: `${shadowx}px ${shadowy}px 40px rgba(0, 0, 0, 0.2)`
            });
          }}
          onMouseLeave={function() {
            anim.start({
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              boxShadow: normalShadow
            });
          }}
        >
          <div className={styles.cardHeader}>
            Frontend dev
          </div>
        </Frame>
      </Frame>
    </div>
  );
}