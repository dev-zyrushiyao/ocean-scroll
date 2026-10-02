import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RoughEase } from "gsap/EasePack";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, RoughEase);

export default function OceanSVGScrollDemo() {
  const container = useRef<SVGSVGElement | null>(null);

  useGSAP(
    () => {
      function initSubmarine(): void {
        //instance of object
        const submarine = container.current?.querySelector("#submarine");
        const lightRange = container.current?.querySelector("#light-range");

        //guard clause
        if (!submarine || !lightRange) return;

        //animation: submarine dive deeper
        const submarineTween = gsap.to(submarine, {
          y: 5200,
          ease: "none",
        });

        //const light rotate
        const lightRotationTl = gsap
          .timeline({ repeat: -1, yoyo: true })
          .set(lightRange, { transformOrigin: "right center" })
          .to(lightRange, {
            duration: 5,
            keyframes: { rotate: [0, 30, -30] },
          });

        //flip switch for lights and flickerAnimation
        let hasFlickered: boolean = false;
        const flickerOnAnimation = gsap
          .timeline({ paused: true })

          .to(lightRange, {
            duration: 1,
            opacity: 1,
            ease: "rough({ template: power1.inOut, strength: 2, points: 10, randomize: true, clamp: true",
          })
          .add(lightRotationTl);

        const flickerOffAnimation = gsap.to(lightRange, {
          paused: true,
          duration: 1,
          opacity: 0,
          ease: "power1",
        });

        ScrollTrigger.create({
          id: "submarine-tween",
          trigger: container.current,
          animation: submarineTween,
          start: () => {
            //recalculate the distance between the submarine and the container every time the screen changes
            const submarineRect = submarine.getBoundingClientRect();
            const svgRect = container.current!.getBoundingClientRect();
            const distanceFromTop = submarineRect.top - svgRect.top;
            return `${distanceFromTop}px ${distanceFromTop / 2}px`;
          },
          onUpdate: (self) => {
            //turn on the light in dark area
            if (self.progress >= 0.5 && !hasFlickered) {
              hasFlickered = true;
              flickerOnAnimation.restart();
            }

            //turn off the light in light area
            if (self.progress <= 0.4 && hasFlickered) {
              hasFlickered = false;
              flickerOffAnimation.restart();
            }
          },
          end: "bottom bottom",
          scrub: true,
          // markers: true,
        });
      }

      function initJellyFish(): void {
        const jellyFish = container.current?.querySelector("#jelly-fish");
        const message = container.current?.querySelector("#message-bubble");
        if (!jellyFish || !message) return;

        const messageTween = gsap.from(message, {
          duration: 1,
          opacity: 0,
        });

        ScrollTrigger.create({
          id: "message-tween",
          trigger: message,
          animation: messageTween,
          start: "top center",
          toggleActions: "restart reverse restart reverse",
          // markers: true,
        });
      }

      function initDeepOcean(): void {
        const deepOcean = container.current?.querySelector("#ocean-2");
        if (!deepOcean) return;

        const deepOceanTween = gsap.from(deepOcean, {
          duration: 5,
          fill: "#4777A3",
        });

        ScrollTrigger.create({
          id: "ocean-tween",
          trigger: deepOcean,
          animation: deepOceanTween,
          start: "top bottom",
          scrub: 1,
          // markers: true,
        });
      }

      function initBigBubble(): void {
        const deepOcean = container.current?.querySelector("#ocean-2");
        const bigBubblesG =
          container.current?.querySelectorAll("#big-bubbles-g > *");
        if (!deepOcean || !bigBubblesG) return;

        const bigBubbleTl = gsap
          .timeline({ defaults: { stagger: 0.01 } })
          .fromTo(
            bigBubblesG,
            { scale: 0.3, transformOrigin: "center center" },
            { scale: 1 },
          )
          .to(
            bigBubblesG,
            {
              y: -20,
              repeat: -1,
              yoyo: true,
            },
            "<",
          );

        ScrollTrigger.create({
          trigger: deepOcean,
          animation: bigBubbleTl,
          start: "100px center",
          once: true,
          // markers: true,
        });
      }

      function initFishSchoolLeft(): void {
        const fishSchoolLeft = container.current?.querySelectorAll(
          "#fish-school-left > *",
        );
        if (!fishSchoolLeft) return;

        console.log("fishSchoolLeft", fishSchoolLeft);

        gsap
          .timeline({
            repeat: -1,
            repeatDelay: 0,
            defaults: { ease: "none", duration: 10, stagger: 0.1 },
          })
          .to(fishSchoolLeft, {
            keyframes: {
              x: [
                0,
                gsap.utils.random(-10, -300),
                gsap.utils.random(-310, -500),
                gsap.utils.random(-510, -700),
                -1200,
              ],
            },
          })
          .set(fishSchoolLeft, {
            scaleX: -1,
            transformOrigin: "center center",
          })
          .to(fishSchoolLeft, {
            keyframes: {
              x: [
                -1200,
                gsap.utils.random(-1100, -700),
                gsap.utils.random(-610, -300),
                gsap.utils.random(-210, -50),
                600,
              ],
            },
          })
          .set(fishSchoolLeft, {
            scaleX: 1,
            transformOrigin: "center center",
          })
          .to(fishSchoolLeft, {
            keyframes: {
              x: [
                600,
                gsap.utils.random(500, 400),
                gsap.utils.random(300, 200),
                gsap.utils.random(100, 50),
                0,
              ],
            },
          });
      }

      function initSmallBubble(): void {
        const smallBubbles = container.current?.querySelectorAll(
          "#small-bubbles-g > *",
        );

        if (!smallBubbles) return;

        gsap.to(smallBubbles, {
          y: () => {
            return gsap.utils.random(-10, 10);
          },
          repeat: -1,
          yoyo: true,
          stagger: 0.01,
        });
      }

      function initFishSchoolRight(): void {
        const fishSchoolRight = container.current?.querySelectorAll(
          "#fish-school-right > *",
        );
        if (!fishSchoolRight) return;

        const fishStartingX = gsap.quickSetter(fishSchoolRight, "x");
        fishStartingX(-300);
        gsap
          .timeline({
            repeat: -1,
            repeatDelay: 1,
            defaults: { ease: "none", duration: 10, stagger: 0.1 },
          })
          .to(fishSchoolRight, {
            x: 1440,
            keyframes: {
              y: [
                0,
                gsap.utils.random(300, -300),
                gsap.utils.random(-300, 300),
              ],
            },
          });
      }

      initSubmarine();
      initDeepOcean();
      initBigBubble();
      initJellyFish();

      //stand alone timeline that doesn't have ScrollTrigger
      initFishSchoolLeft();
      initSmallBubble();
      initFishSchoolRight();
    },
    { scope: container },
  );

  return (
    <div>
      <svg
        ref={container}
        // width={1440}
        // height={6738}
        viewBox="0 0 1440 6592"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Frame 1600" clipPath="url(#clip0_3773_9894)">
          <rect width={1440} height={6738} fill="white" />
          <rect
            id="Rectangle 340"
            x={1}
            width={1440}
            height={394}
            fill="url(#paint0_linear_3773_9894)"
            fillOpacity={0.46}
          />
          <rect
            id="ocean surface"
            x={-1}
            y={394}
            width={1442}
            height={291}
            fill="#73B8F8"
          />
          <g id="island">
            <path
              id="stone"
              d="M1240.97 398.568C1240.97 398.568 1266.03 371.737 1289.1 367.159C1312.18 362.581 1315.76 353.425 1343.21 351.645C1370.66 349.865 1443.06 360.565 1443.06 360.565V418.28H1223.46L1240.97 398.568Z"
              fill="#999999"
            />
            <path
              id="sand"
              d="M1443 418.436C1443 418.436 884.286 416.814 876.335 419.827C868.384 422.839 882.695 425.855 868.38 428.173C854.064 430.491 854.865 428.405 844.525 430.259C834.186 432.114 822.651 447.415 844.124 456.457C865.598 465.499 963.423 491.696 986.487 498.188C1009.55 504.679 899.651 540.323 968.592 564.262C1093.17 607.518 1443 641 1443 641V418.436Z"
              fill="#EEEEEE"
            />
            <g id="tree">
              <path
                id="Rectangle 339"
                d="M1337.25 182.766H1370.43L1411.25 512.004C1411.25 512.004 1406.62 519.161 1398.59 520.752C1390.56 522.342 1382.05 512.004 1382.05 512.004L1337.25 182.766Z"
                fill="#665858"
              />
              <path
                id="leaf"
                d="M1271.68 162.078C1318 162.078 1355.54 172.346 1355.54 185.011C1353.04 196.477 1348.95 189.131 1302.63 189.131C1288.3 189.131 1272.59 195.073 1257.73 202.904L1254.96 195.715L1254.5 195.895L1254.03 196.073L1256.84 203.377C1251.79 206.07 1246.84 208.973 1242.08 211.926L1238.25 202.078L1237.79 202.26L1237.32 202.44L1241.22 212.465C1215.52 228.53 1195.62 245.771 1195.62 238.52C1195.62 226.369 1222.99 167.183 1266.11 162.389L1266.73 166.92L1267.23 166.853L1267.72 166.785L1267.11 162.288C1268.61 162.151 1270.14 162.078 1271.68 162.078Z"
                fill="#5FA962"
              />
              <path
                id="leaf_2"
                d="M1276.38 119.851C1325.38 140.649 1361.08 166.96 1356.14 178.619C1349 188.047 1347.55 179.45 1298.55 158.652C1274.1 148.273 1239.82 150.51 1212.23 153.908L1212.07 143.259L1211.07 143.274L1211.23 154.033C1204.37 154.89 1197.93 155.81 1192.19 156.615L1191.91 141.613L1191.41 141.623L1190.91 141.632L1191.19 156.754C1174.75 159.052 1164.25 160.289 1166.05 156.06C1169.71 147.439 1201.49 120.398 1237.62 115.301L1235.9 122.129L1236.39 122.25L1236.87 122.372L1238.68 115.157C1251.09 113.56 1263.97 114.583 1276.38 119.851Z"
                fill="#5FA962"
              />
              <path
                id="Ellipse 103"
                d="M1357.13 171.085C1346.15 179.604 1348.08 169.864 1306.57 135.031C1265.06 100.199 1163.4 110.864 1173.05 99.3706C1182.69 87.8769 1257.92 52.3705 1299.43 87.2032C1340.94 122.036 1366.78 159.591 1357.13 171.085Z"
                fill="#5FA962"
              />
              <path
                id="leaf_3"
                d="M1372.55 94.1684C1350.85 128.884 1342.14 162.57 1353.08 169.408C1364.16 173.718 1359.73 166.69 1381.42 131.974C1391.59 115.705 1415.01 104.425 1435.9 96.3281L1430.9 91.3993L1431.25 91.0432L1431.61 90.6879L1436.93 95.9351C1442.7 93.7171 1448.26 91.74 1453.26 89.9689L1447.14 83.905L1447.85 83.1955L1454.31 89.599C1468.88 84.4462 1478.42 81.0551 1474.22 78.4258C1463.27 71.588 1394.24 59.4522 1372.55 94.1684Z"
                fill="#5FA962"
              />
              <path
                id="leaf_4"
                d="M1413.18 115.483C1369.05 145.248 1339.02 177.889 1346.1 188.389C1354.9 196.283 1354.69 187.566 1398.82 157.802C1420.84 142.947 1454.92 138.604 1482.65 136.674L1480.77 126.189L1481.76 126.014L1483.66 136.606C1490.56 136.137 1497.05 135.812 1502.84 135.507L1500.25 120.727L1500.74 120.641L1501.24 120.554L1503.84 135.454C1520.42 134.572 1530.96 133.783 1528.39 129.974C1523.16 122.21 1486.8 101.732 1450.37 103.619L1453.35 109.995L1452.9 110.206L1452.44 110.418L1449.29 103.683C1436.81 104.481 1424.36 107.943 1413.18 115.483Z"
                fill="#5FA962"
              />
              <path
                id="leaf_5"
                d="M1416.56 158.102C1377.15 158.102 1345.21 168.868 1345.21 182.15C1347.34 194.175 1350.82 186.471 1390.22 186.471C1402.4 186.471 1415.74 192.685 1428.37 200.881L1430.7 193.415L1431.18 193.563L1431.66 193.713L1429.24 201.449C1433.5 204.25 1437.67 207.266 1441.68 210.335L1444.92 200.089L1445.87 200.39L1442.53 210.984C1464.37 227.82 1481.27 245.863 1481.27 238.266C1481.27 225.532 1458.01 163.539 1421.37 158.438L1420.84 163.163L1420.35 163.108L1419.85 163.053L1420.38 158.312C1419.12 158.174 1417.84 158.102 1416.56 158.102Z"
                fill="#5FA962"
              />
              <ellipse
                id="Ellipse 105"
                cx={1328.5}
                cy={206.637}
                rx={22.2783}
                ry={27.8479}
                fill="#8C8C8C"
              />
              <ellipse
                id="Ellipse 106"
                cx={1360.41}
                cy={192.525}
                rx={16.7087}
                ry={21.0848}
                transform="rotate(-21 1360.41 192.525)"
                fill="#9F9F9F"
              />
            </g>
          </g>
          <g id="sun">
            <g id="glow" filter="url(#filter0_f_3773_9894)">
              <circle
                cx={56.8844}
                cy={58.8844}
                r={92.8844}
                fill="#F3F3ED"
                fillOpacity={0.49}
              />
            </g>
            <g id="radiance">
              <rect
                id="Rectangle 342"
                x={26.125}
                y={154.844}
                width={11.0723}
                height={54.7465}
                rx={5.53616}
                fill="#D3CD26"
              />
              <rect
                id="Rectangle 345"
                x={148.469}
                y={26.8828}
                width={11.0723}
                height={35.7292}
                rx={5.53616}
                transform="rotate(-96 148.469 26.8828)"
                fill="#D3CD26"
              />
              <g id="Group 128">
                <rect
                  id="Rectangle 343"
                  x={93.7891}
                  y={154.688}
                  width={11.0723}
                  height={32.7957}
                  rx={5.53616}
                  transform="rotate(-29 93.7891 154.688)"
                  fill="#D3CD26"
                />
              </g>
              <rect
                id="Rectangle 344"
                x={141.773}
                y={113.867}
                width={11.0723}
                height={30.4956}
                rx={5.53616}
                transform="rotate(-53 141.773 113.867)"
                fill="#D3CD26"
              />
            </g>
            <circle
              id="core"
              cx={53.8088}
              cy={55.8088}
              r={89.8088}
              fill="#E4E192"
            />
          </g>
          <rect
            id="ocean-1"
            y={657}
            width={1440}
            height={1935}
            fill="#4777A3"
          />
          <rect
            id="ocean-2"
            y={2592}
            width={1440}
            height={4146}
            fill="#13222F"
          />
          <g id="fish-small">
            <path
              id="Subtract"
              d="M954.767 4452.03C954.767 4462.69 950.335 4471.34 944.869 4471.34C939.442 4471.34 935.037 4462.82 934.975 4452.26V4484.18H994.359V4452.03C994.359 4462.69 989.928 4471.34 984.462 4471.34C979.028 4471.34 974.62 4462.8 974.567 4452.22C974.515 4462.8 970.105 4471.34 964.672 4471.34C959.206 4471.34 954.774 4462.69 954.774 4452.03C954.774 4452.02 954.774 4452.01 954.774 4452H954.767C954.767 4452.01 954.767 4452.02 954.767 4452.03Z"
              fill="#082A57"
            />
            <path
              id="Polygon 9"
              d="M918.465 4546.57C918.637 4546.28 918.641 4545.91 918.476 4545.59L889.693 4489.55C889.203 4488.6 887.837 4488.81 887.825 4489.84L886.641 4595.52C886.629 4596.55 887.987 4597.06 888.497 4596.21L918.465 4546.57Z"
              fill="#3C5B61"
            />
            <ellipse
              id="Ellipse 107"
              cx={61.9671}
              cy={80.4449}
              rx={61.9671}
              ry={80.4449}
              transform="matrix(-1 0 0 1 1027.92 4468.11)"
              fill="#082A57"
            />
            <ellipse
              id="Ellipse 108"
              cx={5.16393}
              cy={16.089}
              rx={5.16393}
              ry={16.089}
              transform="matrix(-1 0 0 1 1009.84 4508.32)"
              fill="#747474"
            />
            <path
              id="Rectangle 347"
              d="M967.242 4556.59H954.332L949.86 4620.95C949.86 4620.95 959.496 4616.93 962.078 4600.84C964.66 4584.75 967.242 4556.59 967.242 4556.59Z"
              fill="#3C5B61"
            />
          </g>
          <g id="fish-small_2">
            <path
              id="Subtract_2"
              d="M1199.16 3171.03C1199.16 3181.69 1203.59 3190.34 1209.05 3190.34C1214.48 3190.34 1218.88 3181.82 1218.95 3171.26V3203.18H1159.56V3171.03C1159.56 3181.69 1163.99 3190.34 1169.46 3190.34C1174.89 3190.34 1179.3 3181.8 1179.35 3171.22C1179.41 3181.8 1183.82 3190.34 1189.25 3190.34C1194.72 3190.34 1199.15 3181.69 1199.15 3171.03C1199.15 3171.02 1199.15 3171.01 1199.15 3171H1199.16C1199.16 3171.01 1199.16 3171.02 1199.16 3171.03Z"
              fill="#415A6B"
            />
            <path
              id="Polygon 9_2"
              d="M1235.46 3265.57C1235.29 3265.28 1235.28 3264.91 1235.45 3264.59L1264.23 3208.55C1264.72 3207.6 1266.08 3207.81 1266.1 3208.84L1267.28 3314.52C1267.29 3315.55 1265.93 3316.06 1265.42 3315.21L1235.46 3265.57Z"
              fill="#73979E"
            />
            <ellipse
              id="Ellipse 107_2"
              cx={1187.97}
              cy={3267.55}
              rx={61.9671}
              ry={80.4449}
              fill="#415A6B"
            />
            <ellipse
              id="Ellipse 108_2"
              cx={1149.24}
              cy={3243.41}
              rx={5.16393}
              ry={16.089}
              fill="#747474"
            />
            <path
              id="Rectangle 347_2"
              d="M1186.68 3275.59H1199.59L1204.06 3339.95C1204.06 3339.95 1194.43 3335.93 1191.84 3319.84C1189.26 3303.75 1186.68 3275.59 1186.68 3275.59Z"
              fill="#73979E"
            />
          </g>
          <g id="submarine">
            <g id="binocular">
              <path
                id="Ellipse 101"
                d="M889.8 721.714C889.8 731.55 887.176 739.523 883.939 739.523C880.702 739.523 878.078 731.55 878.078 721.714C878.078 711.879 880.702 703.906 883.939 703.906C887.176 703.906 889.8 711.879 889.8 721.714Z"
                fill="#924747"
              />
              <rect
                id="Rectangle 330"
                x={926.312}
                y={729.148}
                width={9.46763}
                height={58.1583}
                fill="#93B1D7"
              />
              <rect
                id="Rectangle 331"
                x={905.891}
                y={723.836}
                width={9.46763}
                height={28.6971}
                transform="rotate(-62 905.891 723.836)"
                fill="#93B0D7"
              />
              <rect
                id="Rectangle 332"
                x={923.469}
                y={734.57}
                width={14.8599}
                height={3.60671}
                rx={1.80336}
                transform="rotate(-29 923.469 734.57)"
                fill="#D9D9D9"
              />
              <path
                id="Ellipse 100"
                d="M885.404 707.211C885.615 707.211 885.995 707.319 886.52 707.91C887.042 708.5 887.581 709.439 888.064 710.728C889.027 713.293 889.652 716.939 889.652 721.039C889.652 725.14 889.027 728.786 888.064 731.352C887.581 732.64 887.042 733.578 886.52 734.168C885.995 734.759 885.615 734.868 885.404 734.868C885.194 734.868 884.813 734.759 884.289 734.168C883.767 733.578 883.227 732.64 882.744 731.352C881.782 728.786 881.156 725.14 881.156 721.039C881.156 716.939 881.782 713.293 882.744 710.728C883.227 709.439 883.766 708.5 884.289 707.91C884.813 707.319 885.194 707.211 885.404 707.211Z"
                fill="#EAEAEA"
                stroke="#DEDEDE"
                strokeWidth={3}
              />
              <path
                id="Rectangle 333"
                d="M883.438 708.485C882.729 706.163 884.883 703.928 887.214 704.603L909.077 710.938C910.359 711.309 911.242 712.484 911.242 713.819V727.938C911.242 729.204 910.447 730.334 909.254 730.762L887.828 738.441C885.414 739.306 883.05 736.924 883.85 734.488C885.183 730.424 886.639 725.359 886.639 722.612C886.639 719.578 884.864 713.156 883.438 708.485Z"
                fill="#7F93B7"
              />
            </g>
            <path
              id="top-fins"
              d="M879.697 785.825C880.885 783.395 883.366 781.866 886.07 781.899L952.184 782.69C956.209 782.738 959.364 786.163 959.083 790.178L956.442 827.951C956.172 831.808 952.827 834.716 948.97 834.446L869.371 828.88C864.418 828.534 861.39 823.284 863.57 818.823L879.697 785.825Z"
              fill="#395D9F"
            />
            <g id="rear">
              <g id="propeller">
                <g id="elesi-fin">
                  <path
                    id="Rectangle 334"
                    d="M1019.7 863.242C1019.66 863.069 1019.67 862.89 1019.73 862.726C1020.09 861.85 1021.5 858.993 1024.83 858.992C1028.14 858.991 1029.55 861.815 1029.91 862.71C1029.98 862.884 1029.98 863.075 1029.94 863.256L1025.5 880.27C1025.24 881.284 1023.79 881.261 1023.56 880.239L1019.7 863.242Z"
                    fill="#EEEEEE"
                  />
                  <path
                    id="Rectangle 336"
                    d="M1026.48 862.989C1026.48 862.936 1026.5 862.885 1026.52 862.838C1026.67 862.54 1027.31 861.417 1028.18 861.57C1029.08 861.728 1029.15 863.039 1029.15 863.325C1029.15 863.362 1029.14 863.397 1029.14 863.433L1024.39 882.038L1026.48 862.989Z"
                    fill="#DADADA"
                  />
                </g>
                <g id="elesi-fin_2">
                  <path
                    id="Rectangle 334_2"
                    d="M1029.05 907.492C1029.09 907.665 1029.08 907.844 1029.02 908.008C1028.66 908.885 1027.25 911.741 1023.92 911.742C1020.61 911.743 1019.2 908.919 1018.84 908.024C1018.77 907.851 1018.77 907.66 1018.81 907.478L1023.25 890.464C1023.51 889.451 1024.96 889.474 1025.19 890.495L1029.05 907.492Z"
                    fill="#D8D8D8"
                  />
                  <path
                    id="Rectangle 336_2"
                    d="M1022.27 907.745C1022.26 907.798 1022.25 907.849 1022.22 907.896C1022.07 908.194 1021.44 909.318 1020.56 909.164C1019.66 909.006 1019.6 907.695 1019.59 907.41C1019.59 907.373 1019.6 907.337 1019.61 907.301L1024.35 888.697L1022.27 907.745Z"
                    fill="#BDBDBD"
                  />
                </g>
                <g id="Group 126">
                  <path
                    id="Rectangle 320"
                    d="M1024.6 881.531H1027.31C1027.31 881.531 1028.21 883.489 1028.21 884.913C1028.21 886.336 1027.31 888.294 1027.31 888.294H1024.6V881.531Z"
                    fill="#D9D9D9"
                  />
                  <rect
                    id="Rectangle 317"
                    x={1003.86}
                    y={881.531}
                    width={20.7386}
                    height={6.76259}
                    fill="#D9D9D9"
                  />
                </g>
              </g>
              <rect
                id="rear-mount"
                x={982.672}
                y={849.977}
                width={28.8537}
                height={67.1751}
                rx={4}
                fill="#A8A8A8"
              />
            </g>
            <g id="arm-right">
              <circle
                id="Ellipse 96"
                cx={871.17}
                cy={905.341}
                r={9.59152}
                fill="#D9D9D9"
                stroke="#707070"
                strokeWidth={14}
              />
              <rect
                id="Rectangle 321"
                x={863.141}
                y={903.453}
                width={13.2019}
                height={62.6856}
                rx={6.60093}
                transform="rotate(-26 863.141 903.453)"
                fill="#999999"
              />
              <rect
                id="Rectangle 325"
                x={856.578}
                y={980.922}
                width={13.2019}
                height={45.8414}
                rx={6.60093}
                transform="rotate(-104 856.578 980.922)"
                fill="#D9D9D9"
              />
              <circle
                id="Ellipse 95"
                cx={900.424}
                cy={962.073}
                r={12.6666}
                fill="#888888"
              />
              <rect
                id="Rectangle 322"
                x={869.211}
                y={919.492}
                width={16.4145}
                height={8.92017}
                rx={3}
                transform="rotate(-26 869.211 919.492)"
                fill="#D9D9D9"
              />
              <rect
                id="Rectangle 323"
                x={874.562}
                y={930.195}
                width={16.4145}
                height={8.92017}
                rx={3}
                transform="rotate(-26 874.562 930.195)"
                fill="#D9D9D9"
              />
              <rect
                id="Rectangle 324"
                x={879.906}
                y={941.258}
                width={16.4145}
                height={8.92017}
                rx={3}
                transform="rotate(-26 879.906 941.258)"
                fill="#D9D9D9"
              />
              <g id="claw-top">
                <path
                  id="Rectangle 326"
                  d="M842.808 965.459L852.483 968.495L851.231 972.59L841.336 969.564L842.808 965.459Z"
                  fill="#DFD02D"
                />
                <path
                  id="Rectangle 327"
                  d="M834.956 972.605L842.805 965.461L845.575 969.048L837.765 975.837L834.956 972.605Z"
                  fill="#DFD02D"
                />
                <circle
                  id="Ellipse 98"
                  cx={843.691}
                  cy={968.496}
                  r={0.53521}
                  fill="#787878"
                />
              </g>
              <g id="claw-bottom">
                <path
                  id="Rectangle 328"
                  d="M849.027 988.68L855.623 980.978L852.391 978.169L845.603 985.978L849.027 988.68Z"
                  fill="#DFD02D"
                />
                <path
                  id="Rectangle 329"
                  d="M838.585 986.776L849.027 988.676L849.475 984.165L839.255 982.547L838.585 986.776Z"
                  fill="#DFD02D"
                />
                <circle
                  id="Ellipse 99"
                  cx={846.91}
                  cy={985.981}
                  r={0.53521}
                  fill="#787878"
                />
              </g>
              <circle
                id="Ellipse 97"
                cx={858.855}
                cy={973.308}
                r={8.20656}
                fill="#888888"
              />
            </g>
            <g id="front-mirror">
              <path
                id="mirror-lg"
                d="M752.217 894.489C752.218 831.692 822.002 824.704 822.002 824.704L885.76 891.654L822.002 959.054C822.002 959.054 752.215 957.286 752.217 894.489Z"
                fill="#EDEAA9"
              />
            </g>
            <g id="body">
              <path
                id="body-frame"
                d="M792.664 867.487C792.664 838.688 817.498 816.165 846.16 818.969L955.572 829.671C980.539 832.113 999.576 853.104 999.576 878.189V896.105C999.576 915.626 987.885 933.128 969.358 939.221C954.206 944.204 933.465 950.451 907.317 957.036C880.02 963.911 854.082 965.885 833.782 965.972C809.99 966.074 792.664 945.919 792.664 922.081V867.487Z"
                fill="#395D9F"
                stroke="#143B81"
                strokeWidth={0.5}
              />
              <path
                id="body-inner-border"
                d="M800.68 875.604C800.68 847.54 824.88 825.595 852.81 828.33L943.711 837.232C968.035 839.615 986.581 860.067 986.581 884.507V894.104C986.581 913.121 975.194 930.102 957.211 935.936C943.713 940.315 925.769 945.655 903.517 951.267C880.399 957.096 858.347 959.045 840.527 959.339C817.564 959.718 800.68 940.239 800.68 916.977V875.604Z"
                stroke="white"
                strokeWidth={3}
              />
              <g id="side-mirror">
                <circle
                  id="mirror-sm"
                  cx={851.025}
                  cy={875.22}
                  r={23.6811}
                  fill="#EDEAA9"
                  stroke="#707070"
                  strokeWidth={14}
                />
              </g>
              <g id="frame-screw">
                <circle
                  id="Ellipse 86"
                  cx={813.377}
                  cy={831.721}
                  r={1.1271}
                  fill="white"
                />
                <circle
                  id="Ellipse 87"
                  cx={812.026}
                  cy={888.526}
                  r={1.1271}
                  fill="white"
                />
                <circle
                  id="Ellipse 88"
                  cx={811.127}
                  cy={952.994}
                  r={1.1271}
                  fill="white"
                />
                <circle
                  id="Ellipse 92"
                  cx={892.729}
                  cy={950.736}
                  r={1.1271}
                  fill="white"
                />
                <circle
                  id="Ellipse 93"
                  cx={894.08}
                  cy={835.776}
                  r={1.1271}
                  fill="white"
                />
                <circle
                  id="Ellipse 89"
                  cx={978.838}
                  cy={920.986}
                  r={1.1271}
                  fill="white"
                />
                <circle
                  id="Ellipse 90"
                  cx={978.838}
                  cy={887.174}
                  r={1.1271}
                  fill="white"
                />
                <circle
                  id="Ellipse 91"
                  cx={978.838}
                  cy={849.752}
                  r={1.1271}
                  fill="white"
                />
              </g>
              <path
                id="flash-light"
                d="M814.175 813.622C814.097 812.149 815.587 811.102 816.947 811.674L841.286 821.909C841.825 822.136 842.187 822.651 842.217 823.234C842.261 824.075 841.616 824.792 840.775 824.836L816.831 826.091C815.728 826.148 814.787 825.301 814.729 824.198L814.175 813.622Z"
                fill="#183262"
              />
              <path
                id="light-range"
                style={{ opacity: 0 }}
                d="M410 768.822C410 761.53 416.451 755.923 423.672 756.939L805.932 810.724C809.986 811.294 813 814.762 813 818.856C813 822.832 810.151 826.237 806.238 826.939L424.119 895.483C416.761 896.803 410 891.147 410 883.671L410 768.822Z"
                fill="url(#paint1_linear_3773_9894)"
              />
              <g id="ZY-24">
                <path
                  d="M893.542 810.795C893.266 810.795 893.042 810.572 893.042 810.295V809.64C893.042 809.538 893.073 809.438 893.132 809.354L898.46 801.712C898.691 801.381 898.454 800.926 898.05 800.926H893.508C893.232 800.926 893.008 800.702 893.008 800.426V799.659C893.008 799.383 893.232 799.159 893.508 799.159H901.121C901.398 799.159 901.621 799.383 901.621 799.659V800.315C901.621 800.417 901.59 800.517 901.532 800.6L896.209 808.243C895.978 808.574 896.215 809.028 896.619 809.028H901.156C901.432 809.028 901.656 809.252 901.656 809.528V810.295C901.656 810.572 901.432 810.795 901.156 810.795H893.542Z"
                  fill="white"
                />
                <path
                  d="M903.336 799.91C903.142 799.577 903.383 799.159 903.768 799.159H904.986C905.168 799.159 905.335 799.258 905.423 799.417L908.1 804.257C908.117 804.288 908.149 804.307 908.184 804.307C908.219 804.307 908.251 804.288 908.268 804.257L910.945 799.417C911.033 799.258 911.2 799.159 911.382 799.159H912.6C912.985 799.159 913.226 799.577 913.032 799.91L909.303 806.338C909.258 806.414 909.235 806.501 909.235 806.589V810.295C909.235 810.572 909.011 810.795 908.735 810.795H907.633C907.357 810.795 907.133 810.572 907.133 810.295V806.589C907.133 806.501 907.11 806.414 907.065 806.338L903.336 799.91Z"
                  fill="white"
                />
                <path
                  d="M918.91 804.131C919.186 804.131 919.41 804.355 919.41 804.631V805.324C919.41 805.6 919.186 805.824 918.91 805.824H914.671C914.395 805.824 914.171 805.6 914.171 805.324V804.631C914.171 804.355 914.395 804.131 914.671 804.131H918.91Z"
                  fill="white"
                />
                <path
                  d="M921.644 810.795C921.368 810.795 921.144 810.572 921.144 810.295V809.483C921.144 809.348 921.198 809.22 921.294 809.126L925.184 805.313C925.57 804.922 925.892 804.576 926.15 804.273C926.407 803.97 926.601 803.676 926.729 803.392C926.858 803.108 926.923 802.805 926.923 802.483C926.923 802.116 926.839 801.801 926.673 801.54C926.506 801.275 926.277 801.07 925.985 800.926C925.693 800.782 925.362 800.71 924.991 800.71C924.608 800.71 924.273 800.79 923.985 800.949C923.697 801.104 923.474 801.326 923.315 801.614C923.228 801.774 923.166 801.951 923.128 802.145C923.074 802.416 922.858 802.642 922.582 802.642H921.576C921.3 802.642 921.072 802.417 921.103 802.143C921.163 801.61 921.323 801.135 921.582 800.716C921.919 800.17 922.383 799.748 922.974 799.449C923.568 799.15 924.25 799 925.019 799C925.799 799 926.485 799.146 927.076 799.438C927.667 799.729 928.125 800.129 928.451 800.636C928.781 801.144 928.945 801.723 928.945 802.375C928.945 802.811 928.862 803.239 928.695 803.659C928.529 804.08 928.235 804.545 927.815 805.057C927.398 805.568 926.813 806.188 926.059 806.915L924.069 808.938C924.059 808.949 924.053 808.963 924.053 808.978C924.053 809.009 924.079 809.034 924.11 809.034H928.621C928.898 809.034 929.121 809.258 929.121 809.534V810.295C929.121 810.572 928.898 810.795 928.621 810.795H921.644Z"
                  fill="white"
                />
                <path
                  d="M931.121 808.636C930.845 808.636 930.621 808.413 930.621 808.136V807.105C930.621 807.01 930.648 806.918 930.699 806.838L935.412 799.392C935.503 799.247 935.663 799.159 935.834 799.159H936.457C936.733 799.159 936.957 799.383 936.957 799.659V801.045C936.957 801.322 936.733 801.545 936.457 801.545H936.38C936.208 801.545 936.049 801.633 935.957 801.779L932.791 806.795C932.784 806.807 932.781 806.82 932.781 806.833C932.781 806.872 932.812 806.903 932.851 806.903H939.173C939.449 806.903 939.673 807.127 939.673 807.403V808.136C939.673 808.413 939.449 808.636 939.173 808.636H931.121ZM936.673 810.795C936.396 810.795 936.173 810.572 936.173 810.295V808.125L936.195 807.375V799.659C936.195 799.383 936.419 799.159 936.695 799.159H937.684C937.96 799.159 938.184 799.383 938.184 799.659V810.295C938.184 810.572 937.96 810.795 937.684 810.795H936.673Z"
                  fill="white"
                />
              </g>
            </g>
            <g id="arm-left">
              <circle
                id="Ellipse 96_2"
                cx={925.636}
                cy={891.675}
                r={13.964}
                fill="#D9D9D9"
                stroke="#707070"
                strokeWidth={14}
              />
              <rect
                id="Rectangle 321_2"
                x={915.492}
                y={889.297}
                width={16.6811}
                height={79.2057}
                rx={8.34053}
                transform="rotate(-26 915.492 889.297)"
                fill="#999999"
              />
              <rect
                id="Rectangle 325_2"
                x={907.203}
                y={987.172}
                width={16.6811}
                height={57.9224}
                rx={8.34053}
                transform="rotate(-104 907.203 987.172)"
                fill="#D9D9D9"
              />
              <circle
                id="Ellipse 95_2"
                cx={962.606}
                cy={963.364}
                r={16.0048}
                fill="#888888"
              />
              <rect
                id="Rectangle 322_2"
                x={923.156}
                y={909.562}
                width={20.7403}
                height={11.271}
                rx={3}
                transform="rotate(-26 923.156 909.562)"
                fill="#D9D9D9"
              />
              <rect
                id="Rectangle 323_2"
                x={929.922}
                y={923.086}
                width={20.7403}
                height={11.271}
                rx={3}
                transform="rotate(-26 929.922 923.086)"
                fill="#D9D9D9"
              />
              <rect
                id="Rectangle 324_2"
                x={936.688}
                y={937.062}
                width={20.7403}
                height={11.271}
                rx={3}
                transform="rotate(-26 936.688 937.062)"
                fill="#D9D9D9"
              />
              <g id="claw-top_2">
                <path
                  id="Rectangle 326_2"
                  d="M889.797 967.647L902.022 971.483L900.441 976.657L887.938 972.834L889.797 967.647Z"
                  fill="#DFD02D"
                />
                <path
                  id="Rectangle 327_2"
                  d="M879.881 976.669L889.798 967.642L893.298 972.175L883.43 980.752L879.881 976.669Z"
                  fill="#DFD02D"
                />
                <circle
                  id="Ellipse 98_2"
                  cx={890.926}
                  cy={971.481}
                  r={0.676259}
                  fill="#787878"
                />
              </g>
              <g id="claw-bottom_2">
                <path
                  id="Rectangle 328_2"
                  d="M897.664 996.982L905.999 987.251L901.916 983.701L893.338 993.569L897.664 996.982Z"
                  fill="#DFD02D"
                />
                <path
                  id="Rectangle 329_2"
                  d="M884.47 994.587L897.664 996.988L898.23 991.289L885.316 989.244L884.47 994.587Z"
                  fill="#DFD02D"
                />
                <circle
                  id="Ellipse 99_2"
                  cx={894.981}
                  cy={993.575}
                  r={0.676259}
                  fill="#787878"
                />
              </g>
              <circle
                id="Ellipse 97_2"
                cx={910.088}
                cy={977.565}
                r={10.3693}
                fill="#888888"
              />
            </g>
          </g>
          <path
            id="island-underneath"
            d="M965 685H1440V1156C1440 1156 1101.5 938.586 1066.5 879.429C1031.5 820.271 965 685 965 685Z"
            fill="#A1A0A0"
            fillOpacity={0.5}
          />
          <g id="fish-small_3">
            <path
              id="Subtract_3"
              d="M260.309 3217C260.308 3219.23 257.423 3221.04 253.862 3221.04C250.351 3221.04 247.497 3219.28 247.419 3217.09V3223.73H286.102V3217C286.101 3219.23 283.215 3221.04 279.654 3221.04C276.124 3221.04 273.259 3219.26 273.21 3217.06C273.161 3219.26 270.295 3221.04 266.765 3221.04C263.204 3221.04 260.318 3219.23 260.317 3217V3217H260.309V3217Z"
              fill="#415A6B"
            />
            <path
              id="Polygon 9_3"
              d="M235.316 3237.49C235.995 3237.13 236.029 3236.17 235.376 3235.76L218.204 3225.03C217.551 3224.62 216.702 3225.07 216.675 3225.84L215.968 3246.08C215.941 3246.85 216.757 3247.36 217.437 3247L235.316 3237.49Z"
              fill="#C1D7DB"
            />
            <ellipse
              id="Ellipse 107_3"
              cx={40.3636}
              cy={16.8182}
              rx={40.3636}
              ry={16.8182}
              transform="matrix(-1 0 0 1 307.961 3220.37)"
              fill="#415A6B"
            />
            <circle
              id="Ellipse 108_3"
              cx={3.36364}
              cy={3.36364}
              r={3.36364}
              transform="matrix(-1 0 0 1 296.188 3228.77)"
              fill="#747474"
            />
            <path
              id="Rectangle 347_3"
              d="M268.438 3238.87H260.028L257.115 3252.32C257.115 3252.32 263.392 3251.48 265.074 3248.12C266.756 3244.75 268.438 3238.87 268.438 3238.87Z"
              fill="#C1D7DB"
            />
          </g>
          <g id="fish-small_4">
            <path
              id="Subtract_4"
              d="M221.7 939.923H238.508V937.002C238.508 937.97 237.254 938.756 235.707 938.756C234.166 938.756 232.916 937.977 232.906 937.014C232.896 937.977 231.646 938.756 230.105 938.756C228.559 938.756 227.305 937.97 227.305 937.002V937H227.303V937.002C227.303 937.971 226.048 938.756 224.501 938.756C222.954 938.756 221.7 937.97 221.7 937.002V939.923Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_4"
              d="M215.569 946.36C216.249 945.999 216.282 945.037 215.629 944.629L209.829 941.005C209.177 940.597 208.327 941.049 208.3 941.818L208.061 948.653C208.035 949.423 208.851 949.933 209.53 949.571L215.569 946.36Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_4"
              cx={17.538}
              cy={7.30752}
              rx={17.538}
              ry={7.30752}
              transform="matrix(-1 0 0 1 248 938.461)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_4"
              cx={1.4615}
              cy={1.4615}
              r={1.4615}
              transform="matrix(-1 0 0 1 242.883 942.117)"
              fill="#57657B"
            />
          </g>
          <g id="fish-small_5">
            <path
              id="Subtract_5"
              d="M317.574 970.002C317.574 971.026 316.248 971.856 314.612 971.856C312.989 971.856 311.671 971.039 311.651 970.025V973.091H329.422V970.002C329.422 971.026 328.096 971.856 326.46 971.856C324.837 971.856 323.519 971.039 323.499 970.025C323.479 971.039 322.162 971.856 320.538 971.856C318.902 971.856 317.576 971.026 317.576 970.002V970H317.574V970.002Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_5"
              d="M305.268 979.855C305.948 979.494 305.982 978.532 305.329 978.124L299.028 974.187C298.375 973.779 297.525 974.231 297.498 975L297.239 982.426C297.212 983.195 298.028 983.705 298.708 983.344L305.268 979.855Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_5"
              cx={18.5437}
              cy={7.72653}
              rx={18.5437}
              ry={7.72653}
              transform="matrix(-1 0 0 1 339.469 971.547)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_5"
              cx={1.54531}
              cy={1.54531}
              r={1.54531}
              transform="matrix(-1 0 0 1 334.055 975.406)"
              fill="#57657B"
            />
          </g>
          <g id="fish-small_6">
            <path
              id="Subtract_6"
              d="M711.566 706.002C711.566 707.026 710.24 707.856 708.604 707.856C706.981 707.856 705.663 707.039 705.644 706.025V709.091H723.414V706.002C723.414 707.026 722.088 707.856 720.452 707.856C718.829 707.856 717.511 707.039 717.491 706.025C717.471 707.039 716.154 707.856 714.53 707.856C712.894 707.856 711.568 707.026 711.568 706.002V706H711.566V706.002Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_6"
              d="M699.261 715.855C699.94 715.494 699.974 714.532 699.321 714.124L693.02 710.187C692.367 709.779 691.518 710.231 691.491 711L691.231 718.426C691.204 719.195 692.02 719.705 692.7 719.344L699.261 715.855Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_6"
              cx={18.5437}
              cy={7.72653}
              rx={18.5437}
              ry={7.72653}
              transform="matrix(-1 0 0 1 733.461 707.547)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_6"
              cx={1.54531}
              cy={1.54531}
              r={1.54531}
              transform="matrix(-1 0 0 1 728.047 711.406)"
              fill="#57657B"
            />
          </g>
          <g id="fish-small_7">
            <path
              id="Subtract_7"
              d="M382.566 1109C382.566 1110.03 381.24 1110.86 379.604 1110.86C377.981 1110.86 376.663 1110.04 376.644 1109.03V1112.09H394.414V1109C394.414 1110.03 393.088 1110.86 391.452 1110.86C389.829 1110.86 388.511 1110.04 388.491 1109.03C388.471 1110.04 387.154 1110.86 385.53 1110.86C383.894 1110.86 382.568 1110.03 382.568 1109V1109H382.566V1109Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_7"
              d="M370.261 1118.86C370.94 1118.49 370.974 1117.53 370.321 1117.12L364.02 1113.19C363.367 1112.78 362.518 1113.23 362.491 1114L362.231 1121.43C362.204 1122.2 363.02 1122.7 363.7 1122.34L370.261 1118.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_7"
              cx={18.5437}
              cy={7.72653}
              rx={18.5437}
              ry={7.72653}
              transform="matrix(-1 0 0 1 404.461 1110.55)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_7"
              cx={1.54531}
              cy={1.54531}
              r={1.54531}
              transform="matrix(-1 0 0 1 399.047 1114.41)"
              fill="#57657B"
            />
          </g>
          <g id="fish-small_8">
            <path
              id="Subtract_8"
              d="M1354.89 1207C1354.89 1208.03 1356.22 1208.86 1357.86 1208.86C1359.48 1208.86 1360.8 1208.04 1360.82 1207.03V1210.09H1343.05V1207C1343.05 1208.03 1344.37 1208.86 1346.01 1208.86C1347.63 1208.86 1348.95 1208.04 1348.97 1207.03C1348.99 1208.04 1350.31 1208.86 1351.93 1208.86C1353.57 1208.86 1354.89 1208.03 1354.89 1207V1207H1354.89V1207Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_8"
              d="M1367.2 1216.86C1366.52 1216.49 1366.49 1215.53 1367.14 1215.12L1373.44 1211.19C1374.09 1210.78 1374.94 1211.23 1374.97 1212L1375.23 1219.43C1375.26 1220.2 1374.44 1220.7 1373.76 1220.34L1367.2 1216.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_8"
              cx={1351.54}
              cy={1216.27}
              rx={18.5437}
              ry={7.72653}
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_8"
              cx={1339.96}
              cy={1213.95}
              r={1.54531}
              fill="#57657B"
            />
          </g>
          <g id="fish-small_9">
            <path
              id="Subtract_9"
              d="M1354.89 1799C1354.89 1800.03 1356.22 1800.86 1357.86 1800.86C1359.48 1800.86 1360.8 1800.04 1360.82 1799.03V1802.09H1343.05V1799C1343.05 1800.03 1344.37 1800.86 1346.01 1800.86C1347.63 1800.86 1348.95 1800.04 1348.97 1799.03C1348.99 1800.04 1350.31 1800.86 1351.93 1800.86C1353.57 1800.86 1354.89 1800.03 1354.89 1799V1799H1354.89V1799Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_9"
              d="M1367.2 1808.86C1366.52 1808.49 1366.49 1807.53 1367.14 1807.12L1373.44 1803.19C1374.09 1802.78 1374.94 1803.23 1374.97 1804L1375.23 1811.43C1375.26 1812.2 1374.44 1812.7 1373.76 1812.34L1367.2 1808.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_9"
              cx={1351.54}
              cy={1808.27}
              rx={18.5437}
              ry={7.72653}
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_9"
              cx={1339.96}
              cy={1805.95}
              r={1.54531}
              fill="#57657B"
            />
          </g>
          <g id="fish-small_10">
            <path
              id="Subtract_10"
              d="M562.895 1625C562.895 1626.03 564.221 1626.86 565.856 1626.86C567.48 1626.86 568.798 1626.04 568.817 1625.03V1628.09H551.047V1625C551.047 1626.03 552.373 1626.86 554.009 1626.86C555.632 1626.86 556.95 1626.04 556.97 1625.03C556.989 1626.04 558.307 1626.86 559.931 1626.86C561.566 1626.86 562.893 1626.03 562.893 1625V1625H562.895V1625Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_10"
              d="M575.2 1634.86C574.521 1634.49 574.487 1633.53 575.14 1633.12L581.441 1629.19C582.094 1628.78 582.943 1629.23 582.97 1630L583.23 1637.43C583.256 1638.2 582.44 1638.7 581.761 1638.34L575.2 1634.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_10"
              cx={559.544}
              cy={1634.27}
              rx={18.5437}
              ry={7.72653}
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_10"
              cx={547.959}
              cy={1631.95}
              r={1.54531}
              fill="#57657B"
            />
          </g>
          <g id="fish-small_11">
            <path
              id="Subtract_11"
              d="M905.895 994.002C905.895 995.026 907.221 995.856 908.856 995.856C910.48 995.856 911.798 995.039 911.817 994.025V997.091H894.047V994.002C894.047 995.026 895.373 995.856 897.009 995.856C898.632 995.856 899.95 995.039 899.97 994.025C899.989 995.039 901.307 995.856 902.931 995.856C904.566 995.856 905.893 995.026 905.893 994.002V994H905.895V994.002Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_11"
              d="M918.2 1003.86C917.521 1003.49 917.487 1002.53 918.14 1002.12L924.441 998.187C925.094 997.779 925.943 998.231 925.97 999L926.23 1006.43C926.256 1007.2 925.44 1007.7 924.761 1007.34L918.2 1003.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_11"
              cx={902.544}
              cy={1003.27}
              rx={18.5437}
              ry={7.72653}
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_11"
              cx={890.959}
              cy={1000.95}
              r={1.54531}
              fill="#57657B"
            />
          </g>
          <g id="fish-small_12">
            <path
              id="Subtract_12"
              d="M189.566 1349C189.566 1350.03 188.24 1350.86 186.604 1350.86C184.981 1350.86 183.663 1350.04 183.644 1349.03V1352.09H201.414V1349C201.414 1350.03 200.088 1350.86 198.452 1350.86C196.829 1350.86 195.511 1350.04 195.491 1349.03C195.471 1350.04 194.154 1350.86 192.53 1350.86C190.894 1350.86 189.568 1350.03 189.568 1349V1349H189.566V1349Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_12"
              d="M177.261 1358.86C177.94 1358.49 177.974 1357.53 177.321 1357.12L171.02 1353.19C170.367 1352.78 169.518 1353.23 169.491 1354L169.231 1361.43C169.204 1362.2 170.02 1362.7 170.7 1362.34L177.261 1358.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_12"
              cx={18.5437}
              cy={7.72653}
              rx={18.5437}
              ry={7.72653}
              transform="matrix(-1 0 0 1 211.461 1350.55)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_12"
              cx={1.54531}
              cy={1.54531}
              r={1.54531}
              transform="matrix(-1 0 0 1 206.047 1354.41)"
              fill="#57657B"
            />
          </g>
          <g id="fish-small_13">
            <path
              id="Subtract_13"
              d="M891.566 2884C891.566 2885.03 890.24 2885.86 888.604 2885.86C886.981 2885.86 885.663 2885.04 885.644 2884.03V2887.09H903.414V2884C903.414 2885.03 902.088 2885.86 900.452 2885.86C898.829 2885.86 897.511 2885.04 897.491 2884.03C897.471 2885.04 896.154 2885.86 894.53 2885.86C892.894 2885.86 891.568 2885.03 891.568 2884V2884H891.566V2884Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_13"
              d="M879.261 2893.86C879.94 2893.49 879.974 2892.53 879.321 2892.12L873.02 2888.19C872.367 2887.78 871.518 2888.23 871.491 2889L871.231 2896.43C871.204 2897.2 872.02 2897.7 872.7 2897.34L879.261 2893.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_13"
              cx={18.5437}
              cy={7.72653}
              rx={18.5437}
              ry={7.72653}
              transform="matrix(-1 0 0 1 913.461 2885.55)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_13"
              cx={1.54531}
              cy={1.54531}
              r={1.54531}
              transform="matrix(-1 0 0 1 908.047 2889.41)"
              fill="#57657B"
            />
          </g>
          <g id="fish-small_14">
            <path
              id="Subtract_14"
              d="M420.324 2901.01C420.324 2904.2 416.19 2906.79 411.09 2906.79C406.154 2906.79 402.123 2904.37 401.869 2901.31V2910.64H457.273V2901.01C457.273 2904.2 453.139 2906.79 448.039 2906.79C442.972 2906.79 438.861 2904.23 438.809 2901.07C438.756 2904.23 434.644 2906.79 429.577 2906.79C424.477 2906.79 420.343 2904.2 420.343 2901.01C420.343 2901.01 420.343 2901 420.343 2901H420.324C420.324 2901 420.324 2901.01 420.324 2901.01Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_14"
              d="M385.21 2930C385.889 2929.64 385.923 2928.68 385.27 2928.27L359.405 2912.11C358.752 2911.7 357.902 2912.16 357.875 2912.92L356.811 2943.41C356.784 2944.18 357.6 2944.69 358.28 2944.32L385.21 2930Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_14"
              cx={57.8128}
              cy={24.0887}
              rx={57.8128}
              ry={24.0887}
              transform="matrix(-1 0 0 1 488.602 2905.82)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_14"
              cx={4.81774}
              cy={4.81774}
              r={4.81774}
              transform="matrix(-1 0 0 1 471.719 2917.85)"
              fill="#57657B"
            />
          </g>
          <g id="fish-school-right">
            <g id="fish-small_15">
              <path
                id="Subtract_15"
                d="M164.508 1742C164.508 1743.33 162.792 1744.4 160.675 1744.4C158.597 1744.4 156.906 1743.36 156.844 1742.07V1746H179.844V1742C179.844 1743.33 178.128 1744.4 176.011 1744.4C173.96 1744.4 172.284 1743.39 172.182 1742.12L172.179 1742.04C172.148 1743.34 170.444 1744.4 168.347 1744.4C166.295 1744.4 164.62 1743.39 164.518 1742.12L164.513 1742H164.508Z"
                fill="#A8C6DB"
              />
              <path
                id="Polygon 9_15"
                d="M149.028 1754.51C149.708 1754.15 149.741 1753.19 149.089 1752.78L140.069 1747.15C139.416 1746.74 138.567 1747.19 138.54 1747.96L138.169 1758.59C138.142 1759.36 138.958 1759.87 139.638 1759.51L149.028 1754.51Z"
                fill="#C1D7DB"
              />
              <ellipse
                id="Ellipse 107_15"
                cx={24}
                cy={10}
                rx={24}
                ry={10}
                transform="matrix(-1 0 0 1 192.844 1744)"
                fill="#A8C6DB"
              />
              <circle
                id="Ellipse 108_15"
                cx={2}
                cy={2}
                r={2}
                transform="matrix(-1 0 0 1 185.844 1749)"
                fill="#747474"
              />
              <path
                id="Rectangle 347_4"
                d="M169.344 1755H164.344L162.612 1763C162.612 1763 166.344 1762.5 167.344 1760.5C168.344 1758.5 169.344 1755 169.344 1755Z"
                fill="#C1D7DB"
              />
            </g>
            <g id="fish-small_16">
              <path
                id="Subtract_16"
                d="M281.309 1852C281.308 1854.23 278.423 1856.04 274.862 1856.04C271.351 1856.04 268.497 1854.28 268.419 1852.09V1858.73H307.102V1852C307.101 1854.23 304.215 1856.04 300.654 1856.04C297.124 1856.04 294.259 1854.26 294.21 1852.06C294.161 1854.26 291.295 1856.04 287.765 1856.04C284.204 1856.04 281.318 1854.23 281.317 1852V1852H281.309V1852Z"
                fill="#A8C6DB"
              />
              <path
                id="Polygon 9_16"
                d="M256.316 1872.49C256.995 1872.13 257.029 1871.17 256.376 1870.76L239.204 1860.03C238.551 1859.62 237.702 1860.07 237.675 1860.84L236.968 1881.08C236.941 1881.85 237.757 1882.36 238.437 1882L256.316 1872.49Z"
                fill="#C1D7DB"
              />
              <ellipse
                id="Ellipse 107_16"
                cx={40.3636}
                cy={16.8182}
                rx={40.3636}
                ry={16.8182}
                transform="matrix(-1 0 0 1 328.961 1855.37)"
                fill="#A8C6DB"
              />
              <circle
                id="Ellipse 108_16"
                cx={3.36364}
                cy={3.36364}
                r={3.36364}
                transform="matrix(-1 0 0 1 317.188 1863.77)"
                fill="#747474"
              />
              <path
                id="Rectangle 347_5"
                d="M289.438 1873.87H281.028L278.115 1887.32C278.115 1887.32 284.392 1886.48 286.074 1883.12C287.756 1879.75 289.438 1873.87 289.438 1873.87Z"
                fill="#C1D7DB"
              />
            </g>
            <g id="fish-small_17">
              <path
                id="Subtract_17"
                d="M419.188 1694C419.188 1695.44 417.322 1696.61 415.02 1696.61C412.729 1696.61 410.87 1695.46 410.851 1694.03V1698.35H435.867V1694C435.867 1695.44 434.001 1696.61 431.698 1696.61C429.413 1696.61 427.558 1695.46 427.53 1694.04C427.502 1695.46 425.647 1696.61 423.361 1696.61C421.059 1696.61 419.191 1695.44 419.191 1694V1694H419.188V1694Z"
                fill="#A8C6DB"
              />
              <path
                id="Polygon 9_17"
                d="M402.475 1707.54C403.155 1707.18 403.188 1706.22 402.535 1705.81L392.467 1699.52C391.815 1699.11 390.965 1699.56 390.938 1700.33L390.524 1712.2C390.497 1712.97 391.313 1713.48 391.993 1713.12L402.475 1707.54Z"
                fill="#C1D7DB"
              />
              <ellipse
                id="Ellipse 107_17"
                cx={26.1046}
                cy={10.8769}
                rx={26.1046}
                ry={10.8769}
                transform="matrix(-1 0 0 1 450 1696.18)"
                fill="#A8C6DB"
              />
              <circle
                id="Ellipse 108_17"
                cx={2.17538}
                cy={2.17538}
                r={2.17538}
                transform="matrix(-1 0 0 1 442.383 1701.62)"
                fill="#747474"
              />
              <path
                id="Rectangle 347_6"
                d="M424.438 1708.14H418.999L417.115 1716.84C417.115 1716.84 421.174 1716.3 422.262 1714.12C423.35 1711.95 424.438 1708.14 424.438 1708.14Z"
                fill="#C1D7DB"
              />
            </g>
          </g>
          <g id="fish-school-left">
            <g id="fish-small_18">
              <path
                id="Subtract_18"
                d="M942.336 1333C942.336 1334.33 944.052 1335.4 946.169 1335.4C948.247 1335.4 949.938 1334.36 950 1333.07V1337H927V1333C927 1334.33 928.716 1335.4 930.833 1335.4C932.884 1335.4 934.56 1334.39 934.662 1333.12L934.665 1333.04C934.696 1334.34 936.399 1335.4 938.497 1335.4C940.548 1335.4 942.224 1334.39 942.326 1333.12L942.331 1333H942.336Z"
                fill="#A8C6DB"
              />
              <path
                id="Polygon 9_18"
                d="M957.816 1345.51C957.136 1345.15 957.102 1344.19 957.755 1343.78L966.775 1338.15C967.427 1337.74 968.277 1338.19 968.304 1338.96L968.675 1349.59C968.702 1350.36 967.886 1350.87 967.206 1350.51L957.816 1345.51Z"
                fill="#C1D7DB"
              />
              <ellipse
                id="Ellipse 107_18"
                cx={938}
                cy={1345}
                rx={24}
                ry={10}
                fill="#A8C6DB"
              />
              <circle
                id="Ellipse 108_18"
                cx={923}
                cy={1342}
                r={2}
                fill="#747474"
              />
              <path
                id="Rectangle 347_7"
                d="M937.5 1346H942.5L944.232 1354C944.232 1354 940.5 1353.5 939.5 1351.5C938.5 1349.5 937.5 1346 937.5 1346Z"
                fill="#C1D7DB"
              />
            </g>
            <g id="fish-small_19">
              <path
                id="Subtract_19"
                d="M990.652 1367C990.653 1369.23 993.538 1371.04 997.099 1371.04C1000.61 1371.04 1003.46 1369.28 1003.54 1367.09V1373.73H964.859V1367C964.86 1369.23 967.746 1371.04 971.307 1371.04C974.837 1371.04 977.702 1369.26 977.751 1367.06C977.8 1369.26 980.666 1371.04 984.196 1371.04C987.757 1371.04 990.643 1369.23 990.644 1367V1367H990.652V1367Z"
                fill="#A8C6DB"
              />
              <path
                id="Polygon 9_19"
                d="M1015.65 1387.49C1014.97 1387.13 1014.93 1386.17 1015.58 1385.76L1032.76 1375.03C1033.41 1374.62 1034.26 1375.07 1034.29 1375.84L1034.99 1396.08C1035.02 1396.85 1034.2 1397.36 1033.52 1397L1015.65 1387.49Z"
                fill="#C1D7DB"
              />
              <ellipse
                id="Ellipse 107_19"
                cx={983.364}
                cy={1387.19}
                rx={40.3636}
                ry={16.8182}
                fill="#A8C6DB"
              />
              <circle
                id="Ellipse 108_19"
                cx={958.137}
                cy={1382.14}
                r={3.36364}
                fill="#747474"
              />
              <path
                id="Rectangle 347_8"
                d="M982.523 1388.87H990.933L993.846 1402.32C993.846 1402.32 987.569 1401.48 985.887 1398.12C984.205 1394.75 982.523 1388.87 982.523 1388.87Z"
                fill="#C1D7DB"
              />
            </g>
            <g id="fish-small_20">
              <path
                id="Subtract_20"
                d="M870.812 1362C870.812 1363.44 872.678 1364.61 874.98 1364.61C877.271 1364.61 879.13 1363.46 879.149 1362.03V1366.35H854.133V1362C854.133 1363.44 855.999 1364.61 858.302 1364.61C860.587 1364.61 862.442 1363.46 862.47 1362.04C862.498 1363.46 864.353 1364.61 866.639 1364.61C868.941 1364.61 870.809 1363.44 870.809 1362V1362H870.812V1362Z"
                fill="#A8C6DB"
              />
              <path
                id="Polygon 9_20"
                d="M887.525 1375.54C886.845 1375.18 886.812 1374.22 887.465 1373.81L897.533 1367.52C898.185 1367.11 899.035 1367.56 899.062 1368.33L899.476 1380.2C899.503 1380.97 898.687 1381.48 898.007 1381.12L887.525 1375.54Z"
                fill="#C1D7DB"
              />
              <ellipse
                id="Ellipse 107_20"
                cx={866.105}
                cy={1375.06}
                rx={26.1046}
                ry={10.8769}
                fill="#A8C6DB"
              />
              <circle
                id="Ellipse 108_20"
                cx={849.793}
                cy={1371.79}
                r={2.17538}
                fill="#747474"
              />
              <path
                id="Rectangle 347_9"
                d="M865.562 1376.14H871.001L872.885 1384.84C872.885 1384.84 868.826 1384.3 867.738 1382.12C866.65 1379.95 865.562 1376.14 865.562 1376.14Z"
                fill="#C1D7DB"
              />
            </g>
            <g id="fish-small_21">
              <path
                id="Subtract_21"
                d="M906.022 1407C906.022 1407.84 907.115 1408.53 908.462 1408.53C909.802 1408.53 910.888 1407.85 910.899 1407.01V1409.54H896.266V1407C896.266 1407.84 897.358 1408.53 898.705 1408.53C900.049 1408.53 901.137 1407.85 901.143 1407.01C901.148 1407.85 902.237 1408.53 903.581 1408.53C904.928 1408.53 906.02 1407.84 906.021 1407V1407H906.022Z"
                fill="#A8C6DB"
              />
              <path
                id="Polygon 9_21"
                d="M916.434 1415.26C915.755 1414.9 915.721 1413.94 916.374 1413.53L921.044 1410.61C921.697 1410.2 922.546 1410.66 922.573 1411.43L922.766 1416.93C922.792 1417.7 921.976 1418.21 921.297 1417.85L916.434 1415.26Z"
                fill="#C1D7DB"
              />
              <ellipse
                id="Ellipse 107_21"
                cx={903.27}
                cy={1414.64}
                rx={15.27}
                ry={6.36249}
                fill="#A8C6DB"
              />
              <circle
                id="Ellipse 108_21"
                cx={893.726}
                cy={1412.73}
                r={1.2725}
                fill="#747474"
              />
              <path
                id="Rectangle 347_10"
                d="M902.953 1415.27H906.134L907.236 1420.36C907.236 1420.36 904.862 1420.05 904.226 1418.77C903.589 1417.5 902.953 1415.27 902.953 1415.27Z"
                fill="#C1D7DB"
              />
            </g>
            <g id="fish-small_22">
              <path
                id="Subtract_22"
                d="M876.022 1452C876.022 1452.84 877.115 1453.53 878.462 1453.53C879.802 1453.53 880.888 1452.85 880.899 1452.01V1454.54H866.266V1452C866.266 1452.84 867.358 1453.53 868.705 1453.53C870.049 1453.53 871.137 1452.85 871.143 1452.01C871.148 1452.85 872.237 1453.53 873.581 1453.53C874.928 1453.53 876.02 1452.84 876.021 1452V1452H876.022Z"
                fill="#A8C6DB"
              />
              <path
                id="Polygon 9_22"
                d="M886.434 1460.26C885.755 1459.9 885.721 1458.94 886.374 1458.53L891.044 1455.61C891.697 1455.2 892.546 1455.66 892.573 1456.43L892.766 1461.93C892.792 1462.7 891.976 1463.21 891.297 1462.85L886.434 1460.26Z"
                fill="#C1D7DB"
              />
              <ellipse
                id="Ellipse 107_22"
                cx={873.27}
                cy={1459.64}
                rx={15.27}
                ry={6.36249}
                fill="#A8C6DB"
              />
              <circle
                id="Ellipse 108_22"
                cx={863.726}
                cy={1457.73}
                r={1.2725}
                fill="#747474"
              />
              <path
                id="Rectangle 347_11"
                d="M872.953 1460.27H876.134L877.236 1465.36C877.236 1465.36 874.862 1465.05 874.226 1463.77C873.589 1462.5 872.953 1460.27 872.953 1460.27Z"
                fill="#C1D7DB"
              />
            </g>
            <g id="fish-small_23">
              <path
                id="Subtract_23"
                d="M995.022 1448C995.022 1448.84 996.115 1449.53 997.462 1449.53C998.802 1449.53 999.888 1448.85 999.899 1448.01V1450.54H985.266V1448C985.266 1448.84 986.358 1449.53 987.705 1449.53C989.049 1449.53 990.137 1448.85 990.143 1448.01C990.148 1448.85 991.237 1449.53 992.581 1449.53C993.928 1449.53 995.02 1448.84 995.021 1448V1448H995.022Z"
                fill="#A8C6DB"
              />
              <path
                id="Polygon 9_23"
                d="M1005.43 1456.26C1004.75 1455.9 1004.72 1454.94 1005.37 1454.53L1010.04 1451.61C1010.7 1451.2 1011.55 1451.66 1011.57 1452.43L1011.77 1457.93C1011.79 1458.7 1010.98 1459.21 1010.3 1458.85L1005.43 1456.26Z"
                fill="#C1D7DB"
              />
              <ellipse
                id="Ellipse 107_23"
                cx={992.27}
                cy={1455.64}
                rx={15.27}
                ry={6.36249}
                fill="#A8C6DB"
              />
              <circle
                id="Ellipse 108_23"
                cx={982.726}
                cy={1453.73}
                r={1.2725}
                fill="#747474"
              />
              <path
                id="Rectangle 347_12"
                d="M991.953 1456.27H995.134L996.236 1461.36C996.236 1461.36 993.862 1461.05 993.226 1459.77C992.589 1458.5 991.953 1456.27 991.953 1456.27Z"
                fill="#C1D7DB"
              />
            </g>
          </g>
          <g id="small-bubbles-g">
            <circle
              id="Ellipse 112"
              cx={255}
              cy={1408}
              r={11}
              fill="#EDEDED"
              fillOpacity={0.5}
              stroke="#436586"
              strokeWidth={2}
            />
            <circle
              id="Ellipse 115"
              cx={825}
              cy={1314}
              r={11}
              fill="#EDEDED"
              fillOpacity={0.5}
              stroke="#436586"
              strokeWidth={2}
            />
            <circle
              id="Ellipse 114"
              cx={394}
              cy={1360}
              r={11}
              fill="#EDEDED"
              fillOpacity={0.5}
              stroke="#436586"
              strokeWidth={2}
            />
            <circle
              id="Ellipse 116"
              cx={682}
              cy={1426}
              r={11}
              fill="#EDEDED"
              fillOpacity={0.5}
              stroke="#436586"
              strokeWidth={2}
            />
            <circle
              id="Ellipse 113"
              cx={977}
              cy={1236}
              r={11}
              fill="#EDEDED"
              fillOpacity={0.5}
              stroke="#436586"
              strokeWidth={2}
            />
            <g id="bubble">
              <circle
                id="Ellipse 113_2"
                cx={755}
                cy={1349}
                r={8}
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_2"
                d="M751.281 1345.92C750.694 1346.94 750.467 1347.53 749.944 1347.23C749.422 1346.93 749.474 1345.86 750.061 1344.84C750.649 1343.82 751.549 1343.24 752.072 1343.55C752.594 1343.85 751.869 1344.91 751.281 1345.92Z"
                fill="white"
              />
            </g>
            <g id="bubble_2">
              <circle
                id="Ellipse 113_3"
                cx={913}
                cy={1278}
                r={8}
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_3"
                d="M917.237 1277.01C917.824 1278.03 918.042 1278.62 918.62 1278.29C919.198 1277.96 919.19 1276.86 918.603 1275.84C918.015 1274.82 917.07 1274.27 916.492 1274.6C915.914 1274.94 916.649 1275.99 917.237 1277.01Z"
                fill="white"
              />
            </g>
            <g id="bubble_3">
              <circle
                id="Ellipse 113_4"
                cx={124.5}
                cy={1253.5}
                r={16.5}
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_4"
                d="M115.807 1246.98C114.665 1248.96 114.242 1250.12 113.118 1249.47C111.994 1248.82 112.008 1246.69 113.151 1244.72C114.293 1242.74 116.13 1241.66 117.254 1242.31C118.378 1242.96 116.949 1245.01 115.807 1246.98Z"
                fill="white"
              />
            </g>
          </g>
          <path
            id="Rectangle 350"
            d="M0 2112L127.937 2145.38L294.209 2160L356 2222L294.209 2412H0V2112Z"
            fill="#287F98"
          />
          <path
            id="Rectangle 362"
            d="M1440 2372L1245.94 2397.48C1245.94 2397.48 1142 2339.5 1106 2341.5C1070 2343.5 993.728 2408.64 993.728 2408.64L957 2513L993.728 2601H1440V2372Z"
            fill="#287F98"
          />
          <path
            id="Rectangle 349"
            d="M0 2306.64L141.548 2251L382.637 2352.3L463 2411.27L0 2746V2592V2306.64Z"
            fill="#022539"
          />
          <path
            id="Union"
            d="M326.4 2129.67C330.697 2127.17 336.205 2128.63 338.703 2132.93C341.2 2137.22 339.744 2142.73 335.453 2145.23C335.454 2145.22 335.459 2145.22 335.461 2145.22C335.466 2145.22 335.47 2145.22 335.475 2145.21C335.483 2145.21 335.491 2145.2 335.498 2145.2C335.511 2145.19 335.521 2145.19 335.529 2145.18L335.322 2145.32C335.089 2145.48 334.686 2145.76 334.159 2146.18C333.103 2147.03 331.571 2148.41 329.927 2150.38C326.673 2154.28 322.911 2160.57 321.527 2169.93C321.133 2172.6 320.552 2176.05 319.836 2180.07C325.3 2178.9 332.639 2177.97 341.003 2178.59C341.297 2177.81 341.636 2176.32 341.694 2173.92C341.763 2171.14 341.436 2168.15 341.052 2165.74C340.864 2164.56 340.673 2163.58 340.531 2162.92C340.461 2162.58 340.404 2162.33 340.367 2162.17C340.349 2162.09 340.336 2162.04 340.328 2162.01C340.325 2161.99 340.322 2161.98 340.321 2161.98L340.323 2161.98C340.323 2161.98 340.323 2161.99 340.323 2161.99L340.325 2161.99C339.125 2157.17 342.058 2152.29 346.879 2151.08C351.701 2149.88 356.586 2152.81 357.789 2157.64L349.161 2159.79C357.79 2157.64 357.79 2157.64 357.791 2157.64C357.791 2157.64 357.791 2157.64 357.792 2157.65C357.793 2157.65 357.794 2157.65 357.795 2157.66C357.798 2157.67 357.801 2157.68 357.804 2157.69C357.81 2157.72 357.819 2157.75 357.828 2157.79C357.847 2157.87 357.872 2157.98 357.903 2158.11C357.964 2158.37 358.047 2158.74 358.143 2159.2C358.335 2160.11 358.585 2161.38 358.828 2162.9C359.303 2165.89 359.794 2170.06 359.689 2174.37C359.589 2178.42 358.945 2183.85 356.157 2188.43C354.67 2190.87 352.501 2193.18 349.466 2194.73C346.431 2196.29 343.102 2196.8 339.755 2196.55C332.954 2196.03 326.977 2196.88 322.702 2197.87C320.576 2198.37 318.905 2198.89 317.807 2199.27C317.26 2199.46 316.858 2199.61 316.618 2199.7C316.497 2199.75 316.417 2199.78 316.38 2199.8C316.377 2199.8 316.375 2199.8 316.373 2199.8L316.121 2199.9C314.269 2209.46 312.187 2219.88 310.186 2229.77C312.467 2229.64 314.801 2230.37 316.655 2231.99C316.665 2232 316.68 2232.01 316.696 2232.03C316.769 2232.09 316.898 2232.19 317.078 2232.34C317.44 2232.62 317.997 2233.05 318.699 2233.53C320.149 2234.52 322.007 2235.62 323.932 2236.36C325.919 2237.12 327.366 2237.27 328.277 2237.13C328.848 2237.05 329.672 2236.82 330.75 2235.33C335.87 2228.26 339.909 2223.62 342.789 2220.65C344.23 2219.17 345.385 2218.1 346.243 2217.36C346.673 2216.99 347.03 2216.7 347.311 2216.48C347.451 2216.37 347.573 2216.28 347.676 2216.2C347.727 2216.17 347.775 2216.13 347.817 2216.1C347.837 2216.09 347.857 2216.07 347.876 2216.06C347.885 2216.05 347.895 2216.05 347.904 2216.04C347.908 2216.04 347.911 2216.03 347.915 2216.03C347.917 2216.03 347.92 2216.03 347.922 2216.03C347.925 2216.02 347.929 2216.02 353.096 2223.39L347.929 2216.02C351.998 2213.17 357.61 2214.15 360.464 2218.22C363.317 2222.29 362.334 2227.9 358.269 2230.75L358.271 2230.75C358.272 2230.75 358.274 2230.75 358.276 2230.75C358.28 2230.75 358.284 2230.74 358.287 2230.74C358.295 2230.74 358.302 2230.73 358.309 2230.73C358.323 2230.72 358.336 2230.71 358.346 2230.7C358.366 2230.69 358.382 2230.68 358.392 2230.67C358.347 2230.7 358.216 2230.81 358 2230.99C357.568 2231.37 356.797 2232.07 355.699 2233.2C353.502 2235.46 350.013 2239.42 345.329 2245.89C341.505 2251.17 336.461 2254.09 330.991 2254.93C325.861 2255.71 321.09 2254.55 317.471 2253.16C313.793 2251.75 310.659 2249.84 308.519 2248.37C307.811 2247.89 307.19 2247.43 306.668 2247.04C305.579 2252.34 304.58 2257.18 303.733 2261.26C303.503 2262.37 303.281 2263.43 303.074 2264.42C303.516 2264.97 303.815 2265.64 303.919 2266.37L313.032 2330.36C313.44 2333.23 310.756 2335.57 307.969 2334.77L238.925 2314.97C235.95 2314.12 235.03 2310.35 237.276 2308.22L255.774 2290.68C255.737 2290.65 255.699 2290.62 255.663 2290.58L261.786 2283.99C255.752 2290.49 255.663 2290.58 255.662 2290.58L255.66 2290.58C255.659 2290.58 255.657 2290.58 255.655 2290.57C255.65 2290.57 255.643 2290.56 255.634 2290.55C255.616 2290.54 255.588 2290.51 255.552 2290.48C255.48 2290.41 255.373 2290.31 255.234 2290.18C254.954 2289.92 254.544 2289.54 254.019 2289.05C252.968 2288.07 251.456 2286.66 249.613 2284.94C248.526 2283.93 247.325 2282.8 246.033 2281.59C245.332 2283.06 244.434 2284.73 243.311 2286.42C241.591 2288.99 238.922 2292.23 235.09 2294.51C230.917 2296.99 226.172 2297.84 221.437 2296.59C216.691 2295.33 213.503 2294.84 211.654 2294.66C210.731 2294.57 210.147 2294.55 209.873 2294.55C209.767 2294.55 209.708 2294.55 209.695 2294.55C209.703 2294.55 209.73 2294.55 209.775 2294.55C209.797 2294.55 209.824 2294.54 209.856 2294.54C209.871 2294.54 209.888 2294.54 209.906 2294.54C209.915 2294.53 209.924 2294.53 209.934 2294.53C209.939 2294.53 209.944 2294.53 209.949 2294.53C209.951 2294.53 209.955 2294.53 209.957 2294.53L209.957 2294.53C205.037 2295.01 201.308 2291.37 201.628 2286.39C201.948 2281.41 206.198 2276.97 211.122 2276.49L210.543 2285.51C211.113 2276.62 211.125 2276.49 211.129 2276.48C211.131 2276.48 211.134 2276.48 211.136 2276.48C211.141 2276.48 211.148 2276.48 211.153 2276.48C211.163 2276.48 211.174 2276.48 211.184 2276.48C211.207 2276.48 211.23 2276.48 211.254 2276.47C211.302 2276.47 211.354 2276.47 211.41 2276.46C211.522 2276.45 211.65 2276.45 211.793 2276.44C212.08 2276.43 212.433 2276.42 212.852 2276.42C213.69 2276.42 214.8 2276.47 216.208 2276.61C218.991 2276.89 222.959 2277.53 228.313 2278.94C228.485 2278.75 228.727 2278.46 229.023 2278.02C229.681 2277.03 230.253 2275.85 230.681 2274.81C230.884 2274.31 231.031 2273.9 231.12 2273.64L231.202 2273.39C231.201 2273.39 231.2 2273.4 231.199 2273.4C231.199 2273.4 231.199 2273.4 231.199 2273.4C231.615 2271.97 232.327 2270.67 233.241 2269.55C229.869 2266.36 226.409 2263.07 223.127 2259.91C223.022 2259.95 222.9 2260 222.764 2260.05C222.09 2260.31 221.054 2260.75 219.779 2261.39C217.207 2262.69 213.794 2264.76 210.404 2267.82C208.27 2269.75 205.767 2271.26 202.979 2271.93C200.191 2272.6 197.695 2272.3 195.645 2271.55C191.84 2270.16 189.268 2267.14 187.714 2264.91C186.036 2262.51 184.795 2259.92 184 2258.06C183.592 2257.1 183.276 2256.27 183.057 2255.67C182.948 2255.37 182.862 2255.12 182.799 2254.94C182.768 2254.85 182.743 2254.77 182.724 2254.71C182.714 2254.68 182.706 2254.66 182.7 2254.64C182.696 2254.63 182.693 2254.62 182.69 2254.61C182.689 2254.61 182.688 2254.6 182.687 2254.6C182.687 2254.6 182.686 2254.6 182.685 2254.6C182.686 2254.59 182.794 2254.54 190.683 2250.62L182.684 2254.59C181.218 2250 183.744 2244.43 188.326 2242.16C192.907 2239.88 197.809 2241.76 199.277 2246.35C199.282 2246.36 199.29 2246.38 199.299 2246.41C199.327 2246.49 199.375 2246.63 199.442 2246.81C199.578 2247.19 199.787 2247.74 200.062 2248.38C200.634 2249.72 201.393 2251.25 202.248 2252.47C202.298 2252.54 202.349 2252.61 202.397 2252.67C205.102 2250.43 207.743 2248.61 210.136 2247.16C209.33 2246.34 208.612 2245.59 207.999 2244.94C204.743 2241.45 201.343 2240.2 198.834 2239.74C197.543 2239.5 196.469 2239.47 195.776 2239.49C195.434 2239.5 195.197 2239.53 195.089 2239.54C195.036 2239.54 195.016 2239.55 195.031 2239.54C195.039 2239.54 195.057 2239.54 195.084 2239.54C195.098 2239.53 195.114 2239.53 195.132 2239.53C195.142 2239.53 195.151 2239.52 195.162 2239.52C195.167 2239.52 195.172 2239.52 195.178 2239.52C195.18 2239.52 195.184 2239.52 195.186 2239.52L195.186 2239.52C190.303 2240.42 185.608 2237.2 184.696 2232.32C183.784 2227.43 187.006 2222.73 191.892 2221.82L193.364 2229.71C191.939 2222.07 191.898 2221.83 191.901 2221.82C191.902 2221.82 191.907 2221.82 191.911 2221.82C191.917 2221.82 191.923 2221.82 191.93 2221.82C191.943 2221.81 191.958 2221.81 191.973 2221.81C192.002 2221.8 192.035 2221.8 192.07 2221.79C192.141 2221.78 192.224 2221.76 192.318 2221.75C192.507 2221.72 192.743 2221.69 193.02 2221.66C193.576 2221.59 194.308 2221.53 195.188 2221.5C196.94 2221.44 199.327 2221.52 202.096 2222.03C207.706 2223.07 214.822 2225.87 221.151 2232.65C224.454 2236.18 231.438 2242.97 239.101 2250.29C239.656 2249.78 240.266 2249.33 240.927 2248.94C240.926 2248.94 240.925 2248.94 240.924 2248.94L240.906 2248.95C240.943 2248.93 241.023 2248.88 241.137 2248.81C241.369 2248.66 241.729 2248.42 242.162 2248.1C243.074 2247.43 244.079 2246.59 244.875 2245.72C245.234 2245.32 245.463 2245.01 245.605 2244.8C242.715 2239.52 240.947 2234.22 239.898 2230.28C239.365 2228.27 239.006 2226.57 238.777 2225.35C238.663 2224.74 238.58 2224.24 238.524 2223.87C238.495 2223.69 238.473 2223.54 238.458 2223.43C238.45 2223.38 238.443 2223.33 238.438 2223.29C238.435 2223.27 238.434 2223.26 238.432 2223.24L238.428 2223.21C238.431 2223.21 238.614 2223.15 247.064 2220.62L238.428 2223.21C237.796 2218.28 241.15 2213.14 245.92 2211.71C250.541 2210.33 254.795 2212.94 255.63 2217.58L255.699 2218.03L255.699 2218.03C255.703 2218.06 255.715 2218.13 255.73 2218.23C255.76 2218.42 255.813 2218.74 255.893 2219.17C256.052 2220.02 256.318 2221.29 256.727 2222.83C257.552 2225.93 258.916 2229.97 261.06 2233.86C263.423 2238.15 263.744 2242.96 262.346 2247.61C261.062 2251.88 258.565 2255.25 256.481 2257.55C254.781 2259.42 253.011 2260.94 251.55 2262.08C255.472 2265.77 259.077 2269.15 261.901 2271.79C263.736 2273.5 265.239 2274.91 266.283 2275.88C266.805 2276.36 267.213 2276.74 267.489 2277C267.628 2277.13 267.733 2277.23 267.804 2277.29C267.839 2277.33 267.866 2277.35 267.883 2277.37C267.892 2277.37 267.899 2277.38 267.903 2277.38L267.91 2277.39L268.242 2277.71C268.436 2277.91 268.619 2278.12 268.792 2278.34L284.99 2262.98C285.322 2261.39 285.698 2259.59 286.109 2257.6C287.628 2250.28 289.639 2240.51 291.772 2230.01C290.995 2230.09 289.976 2230.18 288.786 2230.23C286.193 2230.34 282.526 2230.3 278.656 2229.55C274.851 2228.81 270.19 2227.26 266.254 2223.88C262.057 2220.28 259.33 2215.12 258.885 2208.62C258.373 2201.13 256.785 2194.33 255.3 2189.37C254.562 2186.91 253.862 2184.93 253.358 2183.6C253.107 2182.94 252.905 2182.44 252.773 2182.12L252.606 2181.72L252.606 2181.73L252.434 2181.31C250.723 2176.87 252.78 2171.81 257.18 2169.86C261.722 2167.84 267.042 2169.89 269.061 2174.43L260.836 2178.08C268.961 2174.47 269.06 2174.43 269.062 2174.43C269.062 2174.43 269.062 2174.43 269.063 2174.43C269.064 2174.44 269.065 2174.44 269.066 2174.44C269.069 2174.45 269.071 2174.46 269.075 2174.46C269.081 2174.48 269.089 2174.5 269.099 2174.52C269.117 2174.56 269.143 2174.62 269.173 2174.69C269.231 2174.82 269.31 2175.01 269.408 2175.25C269.603 2175.72 269.87 2176.38 270.188 2177.22C270.824 2178.9 271.668 2181.28 272.544 2184.21C274.289 2190.04 276.214 2198.2 276.843 2207.39C276.969 2209.22 277.547 2209.85 277.986 2210.23C278.685 2210.83 279.991 2211.47 282.08 2211.88C284.105 2212.27 286.261 2212.32 288.019 2212.25C288.87 2212.21 289.566 2212.15 290.026 2212.1C290.254 2212.07 290.42 2212.05 290.514 2212.04C290.534 2212.03 290.553 2212.03 290.566 2212.03C292.217 2211.76 293.836 2211.96 295.289 2212.53C299.003 2193.89 302.441 2175.96 303.721 2167.3C305.655 2154.21 311.043 2144.91 316.108 2138.84C318.624 2135.83 321.045 2133.63 322.901 2132.14C323.83 2131.39 324.624 2130.82 325.224 2130.42C325.524 2130.21 325.777 2130.05 325.975 2129.93C326.074 2129.86 326.159 2129.81 326.23 2129.77C326.266 2129.75 326.299 2129.73 326.327 2129.71C326.341 2129.7 326.354 2129.7 326.366 2129.69C326.372 2129.69 326.378 2129.68 326.383 2129.68C326.386 2129.68 326.39 2129.67 326.392 2129.67C326.396 2129.67 326.435 2129.73 330.664 2137L326.4 2129.67ZM199.274 2246.33C199.275 2246.34 199.276 2246.34 199.276 2246.34C199.277 2246.34 199.277 2246.34 199.277 2246.34L199.277 2246.35C199.275 2246.34 199.274 2246.33 199.273 2246.33L199.274 2246.33ZM307.647 2242.25L307.646 2242.26C308.417 2241.38 309.396 2240.26 310.637 2238.85L307.647 2242.25ZM316.633 2231.97C316.635 2231.98 316.64 2231.98 316.644 2231.98L316.645 2231.99C316.638 2231.98 316.633 2231.97 316.631 2231.97C316.631 2231.97 316.632 2231.97 316.633 2231.97ZM290.578 2212.03L290.581 2212.03C290.587 2212.02 290.591 2212.02 290.594 2212.02C290.595 2212.02 290.596 2212.02 290.597 2212.02C290.594 2212.02 290.587 2212.03 290.578 2212.03Z"
            fill="black"
          />
          <circle
            id="Ellipse 117"
            cx={394.5}
            cy={2201.5}
            r={6.5}
            fill="black"
          />
          <circle id="Ellipse 118" cx={417} cy={2122} r={3} fill="black" />
          <circle
            id="Ellipse 119"
            cx={284.5}
            cy={2062.5}
            r={6.5}
            fill="black"
          />
          <circle
            id="Ellipse 120"
            cx={235.5}
            cy={2119.5}
            r={3.5}
            fill="black"
          />
          <path
            id="Union_2"
            d="M1401.92 2328.26C1420.89 2301.88 1429.96 2259.74 1437.83 2270.83C1445.59 2281.75 1437.43 2313.1 1427.99 2351.59C1420.61 2381.66 1400.59 2357.75 1403.15 2406.51C1405.71 2455.27 1383.48 2479.8 1373.55 2495.68C1367.18 2505.88 1366.27 2518.13 1364.57 2528.86C1369.53 2523.34 1373.04 2517.16 1373.73 2510.28C1376.77 2479.95 1403.65 2491.68 1419.98 2480.61C1436.34 2469.51 1420.51 2449.38 1433.53 2436.73C1446.55 2424.07 1442.53 2433.04 1461.9 2422.34C1487.52 2408.18 1505.91 2380.62 1511.96 2390.26C1517.93 2399.76 1502.76 2419.93 1484.74 2444.84C1470.66 2464.3 1454.36 2442.8 1446.96 2477.74C1439.55 2512.67 1410.84 2524.77 1397.01 2533.64C1382.23 2543.11 1382.32 2560.1 1370.16 2566.37C1363.57 2569.77 1355.89 2571.51 1348.44 2572.02C1342.69 2574.34 1331.5 2574.12 1318.92 2571.45C1306.51 2573.09 1293.35 2573.6 1282.4 2572C1264.87 2569.45 1265.88 2555.55 1244.66 2550.93C1224.8 2546.6 1183.26 2542.78 1174.19 2515.79C1165.11 2488.8 1140.07 2509.82 1120.4 2496.89C1095.22 2480.34 1073.97 2467.06 1083.23 2458.03C1092.62 2448.87 1118.2 2467.52 1155.11 2473.67C1183 2478.32 1177.56 2471.84 1196.03 2479.43C1214.49 2487.02 1190.2 2506.82 1213.66 2512.44C1226.3 2515.46 1243.82 2512.39 1257.71 2512.74C1255.82 2508.8 1253.25 2504.88 1249.51 2501.08C1233.48 2484.77 1197.56 2458.37 1201.76 2414.12C1205.96 2369.87 1173.55 2388.26 1161.66 2359.4C1146.45 2322.45 1133.29 2292.28 1145.85 2283.62C1158.59 2274.85 1173.21 2315.08 1203.86 2342.59C1227.02 2363.39 1225.07 2351.13 1238.33 2371.54C1251.58 2391.95 1220.42 2408.94 1239.11 2428.92C1257.77 2448.87 1301.18 2446.45 1292.68 2483.44C1289.52 2497.23 1298.04 2512.02 1309.49 2525.48C1311.14 2514.36 1314.48 2501.87 1311.43 2489.66C1306.9 2471.49 1293.34 2441.29 1310.84 2395.71C1328.34 2350.13 1301.91 2366.68 1304.19 2335.8C1307.1 2296.28 1309.03 2263.95 1319.78 2255.95C1330.69 2247.84 1326.3 2290.72 1336.2 2321.67C1343.67 2345.05 1346.58 2332.18 1348 2354.4C1349.42 2376.61 1324.24 2391.79 1329.2 2413.99C1332.41 2428.4 1345.34 2433.81 1349.12 2446.19C1355.7 2432.2 1371.78 2432.21 1380.05 2418.23C1391.62 2398.64 1372.37 2376.42 1380.58 2355.73C1388.79 2335.05 1387.58 2348.19 1401.92 2328.26ZM1346.65 2469.38C1345.99 2471.08 1345.22 2472.86 1344.33 2474.74C1339.21 2485.62 1338.27 2497.67 1339.32 2509.45C1344.88 2497.6 1348.55 2484.57 1346.88 2471.32C1346.79 2470.66 1346.72 2470.01 1346.65 2469.38Z"
            fill="#12433F"
          />
          <g id="weeds">
            <g id="leaf_6">
              <path
                id="Ellipse 121"
                d="M1263.94 2368.16C1285.49 2392.1 1248.26 2420.77 1276.85 2443.03C1305.38 2465.25 1361.63 2453.09 1358.18 2503.21C1354.73 2553.33 1462.68 2595.37 1451.73 2605.78C1439.98 2616.96 1382.54 2616.57 1347.78 2595.37C1325.93 2582.04 1331.37 2554.43 1305.38 2535.22C1281.04 2517.22 1228.61 2490.14 1224.94 2431.41C1221.27 2372.68 1182.71 2403.44 1161.18 2368.16C1133.64 2323.01 1110.18 2286.28 1124.81 2272.36C1139.65 2258.25 1167.1 2307.82 1212.87 2337.45C1247.46 2359.84 1242.38 2344.22 1263.94 2368.16Z"
                fill="#2C9587"
              />
              <path
                id="Vector 142"
                d="M1398.79 2598.57C1398.79 2598.57 1335.18 2535.96 1329.14 2506C1323.1 2476.04 1260.89 2497.96 1253.92 2443.85C1251.64 2426.09 1252.6 2414.2 1238.13 2394.21C1208.51 2353.3 1133.66 2291.37 1133.66 2291.37"
                stroke="#12433F"
                strokeWidth={5}
                strokeLinecap="round"
              />
            </g>
            <g id="leaf_7">
              <path
                id="Ellipse 121_2"
                d="M1230.97 2517.99C1256.69 2524.1 1229.02 2555.02 1260.85 2557.5C1292.62 2559.97 1341.87 2531.69 1350.67 2562.67C1359.46 2593.65 1469.6 2578.11 1461.95 2588.37C1453.73 2599.39 1400.38 2620.68 1363.08 2621.15C1339.62 2621.44 1338.06 2603.05 1309.37 2601.4C1282.5 2599.86 1227.4 2603.46 1209.95 2570.06C1192.49 2536.65 1164.1 2569.32 1135.7 2556.48C1099.35 2540.06 1068.82 2527.09 1079.05 2513.37C1089.44 2499.45 1126.75 2518.53 1176.27 2518.93C1213.7 2519.24 1205.25 2511.89 1230.97 2517.99Z"
                fill="#2C9587"
              />
              <path
                id="Vector 142_2"
                d="M1411.12 2603.93C1411.12 2603.93 1337.16 2590.69 1324.4 2575.2C1311.63 2559.72 1259.19 2596 1239.78 2566.57C1233.42 2556.91 1231.47 2549.5 1213.27 2543.09C1176.01 2529.95 1091.8 2521.31 1091.8 2521.31"
                stroke="#12433F"
                strokeWidth={5}
                strokeLinecap="round"
              />
            </g>
            <g id="leaf_8">
              <path
                id="Ellipse 121_3"
                d="M1532.67 2412.97C1518.27 2432.21 1543.14 2455.25 1524.04 2473.15C1504.99 2491.01 1467.41 2481.24 1469.71 2521.52C1472.02 2561.81 1399.91 2595.6 1407.23 2603.97C1415.07 2612.96 1453.44 2612.64 1476.66 2595.6C1491.26 2584.89 1487.63 2562.69 1504.98 2547.25C1521.24 2532.78 1556.26 2511.01 1558.71 2463.81C1561.17 2416.6 1586.93 2441.33 1601.3 2412.97C1619.71 2376.67 1635.37 2347.15 1625.6 2335.97C1615.69 2324.62 1597.35 2364.47 1566.78 2388.29C1543.67 2406.28 1547.07 2393.72 1532.67 2412.97Z"
                fill="#2C9587"
              />
              <path
                id="Vector 142_3"
                d="M1442.59 2598.16C1442.59 2598.16 1485.08 2547.84 1489.11 2523.76C1493.15 2499.68 1534.71 2517.29 1539.36 2473.8C1540.88 2459.53 1540.24 2449.97 1549.9 2433.9C1569.69 2401.02 1619.69 2351.23 1619.69 2351.23"
                stroke="#12433F"
                strokeWidth={5}
                strokeLinecap="round"
              />
            </g>
            <g id="leaf_9">
              <path
                id="Ellipse 121_4"
                d="M1446.67 2318.04C1440.21 2346.79 1469.99 2371.86 1458.91 2399.86C1447.85 2427.81 1411.15 2423.17 1426.54 2476.15C1441.93 2529.13 1388.89 2590.01 1398.18 2599.5C1408.14 2609.68 1442.21 2600.75 1457.24 2572.96C1466.7 2555.49 1456.12 2526.84 1466.46 2502.48C1476.15 2479.66 1500.14 2442.98 1486.7 2379.76C1473.25 2316.54 1504.38 2343.65 1507.8 2302.8C1512.17 2250.53 1516.35 2207.85 1503.95 2195.17C1491.36 2182.31 1488.22 2239.29 1468.88 2277.7C1454.26 2306.72 1453.12 2289.29 1446.67 2318.04Z"
                fill="#2C9587"
              />
              <path
                id="Vector 142_4"
                d="M1427.76 2583.93C1427.76 2583.93 1448.94 2507.69 1444.56 2474.82C1440.18 2441.95 1483.03 2456.1 1472.77 2397.33C1469.41 2378.04 1465.67 2365.49 1468.96 2342.01C1475.69 2293.96 1503.74 2216.76 1503.74 2216.76"
                stroke="#12433F"
                strokeWidth={5}
                strokeLinecap="round"
              />
            </g>
            <g id="leaf_10">
              <path
                id="Ellipse 121_5"
                d="M1403.79 2323.04C1410.25 2351.79 1380.47 2376.85 1391.55 2404.85C1402.61 2432.8 1439.31 2428.17 1423.92 2481.14C1408.54 2534.12 1461.57 2595 1452.28 2604.49C1442.32 2614.67 1408.25 2605.74 1393.22 2577.96C1383.76 2560.49 1394.34 2531.83 1384 2507.47C1374.31 2484.65 1350.32 2447.97 1363.76 2384.75C1377.21 2321.53 1346.08 2348.64 1342.66 2307.8C1338.29 2255.52 1334.11 2212.84 1346.52 2200.16C1359.1 2187.3 1362.24 2244.28 1381.58 2282.69C1396.2 2311.72 1397.34 2294.29 1403.79 2323.04Z"
                fill="#2C9587"
              />
              <path
                id="Vector 142_5"
                d="M1422.71 2588.93C1422.71 2588.93 1401.52 2512.68 1405.91 2479.81C1410.29 2446.94 1367.44 2461.1 1377.7 2402.32C1381.06 2383.03 1384.8 2370.48 1381.51 2347.01C1374.78 2298.95 1346.73 2221.75 1346.73 2221.75"
                stroke="#12433F"
                strokeWidth={5}
                strokeLinecap="round"
              />
            </g>
          </g>
          <g id="big-bubbles-g">
            <g id="bubble_4">
              <circle
                id="Ellipse 113_5"
                cx={410}
                cy={2966}
                r={180}
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_5"
                d="M320.092 2898.6C308.278 2919.06 303.902 2931.05 292.277 2924.34C280.651 2917.63 280.803 2895.6 292.617 2875.14C304.431 2854.67 323.432 2843.53 335.058 2850.24C346.684 2856.95 331.906 2878.14 320.092 2898.6Z"
                fill="white"
              />
            </g>
            <g id="bubble_5">
              <circle
                id="Ellipse 113_6"
                cx={1218}
                cy={3582}
                r={180}
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_6"
                d="M1128.09 3514.6C1116.28 3535.06 1111.9 3547.05 1100.28 3540.34C1088.65 3533.63 1088.8 3511.6 1100.62 3491.14C1112.43 3470.67 1131.43 3459.53 1143.06 3466.24C1154.68 3472.95 1139.91 3494.14 1128.09 3514.6Z"
                fill="white"
              />
            </g>
            <g id="bubble_6">
              <circle
                id="Ellipse 113_7"
                cx={115}
                cy={115}
                r={114}
                transform="matrix(-1 0 0 1 1356 2653)"
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_7"
                d="M1298.13 2725.17C1305.63 2738.17 1308.41 2745.79 1315.8 2741.53C1323.19 2737.26 1323.09 2723.27 1315.58 2710.27C1308.08 2697.27 1296 2690.18 1288.62 2694.45C1281.23 2698.71 1290.62 2712.17 1298.13 2725.17Z"
                fill="white"
              />
            </g>
            <g id="bubble_7">
              <circle
                id="Ellipse 113_8"
                cx={196.5}
                cy={3300.5}
                r={94.5}
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_8"
                d="M149.062 3264.94C142.829 3275.73 140.52 3282.06 134.386 3278.52C128.252 3274.98 128.332 3263.35 134.565 3252.56C140.798 3241.76 150.824 3235.88 156.958 3239.42C163.092 3242.96 155.295 3254.14 149.062 3264.94Z"
                fill="white"
              />
            </g>
            <g id="bubble_8">
              <circle
                id="Ellipse 113_9"
                cx={505.5}
                cy={3425.5}
                r={94.5}
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_9"
                d="M458.062 3389.94C451.829 3400.73 449.52 3407.06 443.386 3403.52C437.252 3399.98 437.332 3388.35 443.565 3377.56C449.798 3366.76 459.824 3360.88 465.958 3364.42C472.092 3367.96 464.295 3379.14 458.062 3389.94Z"
                fill="white"
              />
            </g>
            <g id="bubble_9">
              <circle
                id="Ellipse 113_10"
                cx={932.5}
                cy={2933.5}
                r={106.5}
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_10"
                d="M879.098 2893.47C872.082 2905.62 869.483 2912.75 862.578 2908.76C855.673 2904.77 855.763 2891.69 862.78 2879.54C869.796 2867.38 881.082 2860.76 887.987 2864.75C894.892 2868.74 886.115 2881.32 879.098 2893.47Z"
                fill="white"
              />
            </g>
            <g id="bubble_10">
              <circle
                id="Ellipse 113_11"
                cx={58}
                cy={58}
                r={57}
                transform="matrix(-1 0 0 1 754 2768)"
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_11"
                d="M724.808 2804.4C728.594 2810.96 729.996 2814.8 733.721 2812.65C737.447 2810.5 737.398 2803.44 733.612 2796.88C729.827 2790.32 723.738 2786.75 720.012 2788.9C716.287 2791.05 721.022 2797.84 724.808 2804.4Z"
                fill="white"
              />
            </g>
            <g id="bubble_11">
              <circle
                id="Ellipse 113_12"
                cx={58}
                cy={58}
                r={57}
                transform="matrix(-1 0 0 1 613 3224)"
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
              <path
                id="Ellipse 114_12"
                d="M583.808 3260.4C587.594 3266.96 588.996 3270.8 592.721 3268.65C596.447 3266.5 596.398 3259.44 592.612 3252.88C588.827 3246.32 582.738 3242.75 579.012 3244.9C575.287 3247.05 580.022 3253.84 583.808 3260.4Z"
                fill="white"
              />
            </g>
            <g id="bubble_12">
              <circle
                id="Ellipse 113_13"
                cx={58}
                cy={58}
                r={57}
                transform="matrix(-1 0 0 1 717 2998)"
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
            </g>
            <g id="bubble_13">
              <circle
                id="Ellipse 113_14"
                cx={58}
                cy={58}
                r={57}
                transform="matrix(-1 0 0 1 217 2710)"
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
            </g>
            <g id="bubble_14">
              <circle
                id="Ellipse 113_15"
                cx={58}
                cy={58}
                r={57}
                transform="matrix(-1 0 0 1 941 3089)"
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
            </g>
            <g id="bubble_15">
              <circle
                id="Ellipse 113_16"
                cx={29}
                cy={29}
                r={28}
                transform="matrix(-1 0 0 1 774 3454)"
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
            </g>
            <g id="bubble_16">
              <circle
                id="Ellipse 113_17"
                cx={138.5}
                cy={138.5}
                r={137.5}
                transform="matrix(-1 0 0 1 1356 3024)"
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
            </g>
            <g id="bubble_17">
              <path
                id="Ellipse 114_13"
                d="M910.062 3288.94C903.829 3299.73 901.52 3306.06 895.386 3302.52C889.252 3298.98 889.332 3287.35 895.565 3276.56C901.798 3265.76 911.824 3259.88 917.958 3263.42C924.092 3266.96 916.295 3278.14 910.062 3288.94Z"
                fill="white"
              />
              <circle
                id="Ellipse 113_18"
                cx={944.5}
                cy={3327.5}
                r={94.5}
                fill="#EDEDED"
                fillOpacity={0.5}
                stroke="#436586"
                strokeWidth={2}
              />
            </g>
          </g>
          <g id="shark">
            <path
              id="Vector 143"
              d="M871.598 4220.75C870.687 4220.5 822.098 4172.25 828.598 4162.25C835.098 4152.25 830.098 4148.25 930.598 4141.25C1031.1 4134.25 1075.6 4127.25 1075.6 4127.25C1075.6 4127.25 1089.1 4101.25 1111.6 4069.25C1134.1 4037.25 1162.1 4018.75 1163.6 4025.75C1165.1 4032.75 1155.1 4056.25 1157.1 4083.75C1159.1 4111.25 1176.1 4120.25 1181.1 4119.25C1186.1 4118.25 1257.1 4082.25 1257.1 4082.25C1257.1 4082.25 1259.6 4034.25 1264.6 4030.75C1269.6 4027.25 1270.6 4042.75 1275.6 4050.75C1280.6 4058.75 1286.6 4057.75 1286.6 4057.75C1286.6 4057.75 1315.1 4020.25 1316.6 4009.75C1318.1 3999.25 1295.6 3930.25 1304.1 3926.25C1312.6 3922.25 1338.6 3967.25 1353.1 3971.25C1367.6 3975.25 1436.6 3980.25 1439.6 3983.25C1442.6 3986.25 1350.6 4012.75 1346.1 4022.75C1341.6 4032.75 1342.1 4049.75 1339.6 4075.25C1337.1 4100.75 1327.1 4129.25 1327.1 4129.25C1327.1 4129.25 1350.6 4127.25 1354.1 4127.25C1357.6 4127.25 1342.1 4145.25 1331.6 4158.75C1321.1 4172.25 1295.1 4175.25 1295.1 4175.25C1295.1 4175.25 1269.71 4215.8 1234.1 4238.75C1195.15 4263.85 1145.64 4271.77 1144.6 4277.25C1142.6 4287.75 1142.6 4294.75 1153.6 4321.75C1164.6 4348.75 1170.6 4371.75 1170.6 4371.75C1170.6 4371.75 1132.6 4355.75 1111.1 4338.25C1089.6 4320.75 1052.1 4282.75 1052.1 4282.75C1052.1 4282.75 1011.68 4282.29 971.596 4273.75C931.804 4265.27 892.345 4248.73 891.098 4243.75C888.596 4233.75 920.596 4237.75 920.596 4234.25C920.596 4230.75 916.596 4229.25 903.096 4221.25C889.596 4213.25 872.51 4221 871.598 4220.75Z"
              fill="#0B3A63"
            />
            <circle
              id="Ellipse 122"
              cx={925.5}
              cy={4191.5}
              r={11.5}
              fill="#D9D9D9"
            />
          </g>
          <g id="jelly-fish">
            <path
              id="Rectangle 354"
              d="M158.847 5154.26C158.965 5152.96 160.054 5152 161.356 5152C162.812 5152 163.975 5153.2 163.918 5154.66C163.577 5163.37 162.641 5190.56 164.213 5191.5C165.945 5192.53 164.315 5221.61 164.059 5225.98C164.037 5226.35 163.932 5226.7 163.75 5227.03L163.579 5227.34C162.695 5228.93 160.402 5228.93 159.519 5227.34C159.231 5226.82 159.151 5226.21 159.287 5225.64C160.272 5221.44 164.119 5203.38 160.31 5192.25C156.726 5181.77 158.222 5161.1 158.847 5154.26Z"
              fill="#9DD5EE"
            />
            <path
              id="Rectangle 357"
              d="M233.218 5157.33C233.465 5155.95 234.67 5155 236.065 5155H238.185C239.95 5155 241.337 5156.5 241.201 5158.26C240.61 5165.9 239.431 5184.33 241.763 5185C244.335 5185.74 242.191 5205.49 241.607 5210.47C241.521 5211.2 241.164 5211.87 240.609 5212.36L239.548 5213.28C238.418 5214.27 236.734 5214.27 235.605 5213.28L235.48 5213.17C234.428 5212.25 234.142 5210.73 234.702 5209.45C236.792 5204.68 240.934 5193.06 235.629 5185.57C230.204 5177.9 232.187 5163.05 233.218 5157.33Z"
              fill="#9DD5EE"
            />
            <path
              id="Rectangle 355"
              d="M199.941 5154.11C199.788 5152.89 198.742 5152 197.509 5152C196.008 5152 194.837 5153.3 194.983 5154.79C195.616 5161.31 196.883 5177.13 194.506 5179.5C191.82 5182.18 194.082 5199.54 194.594 5203.21C194.658 5203.66 194.842 5204.08 195.128 5204.43L195.46 5204.85C196.335 5205.95 198.005 5205.95 198.881 5204.85C199.357 5204.25 199.489 5203.46 199.254 5202.73C198.063 5199.03 194.8 5187.37 198.409 5180.02C201.867 5172.98 200.596 5159.34 199.941 5154.11Z"
              fill="#9DD5EE"
            />
            <path
              id="Rectangle 352"
              d="M151.039 5143H267V5160.42C267 5160.42 264.823 5172.18 260.463 5173.92C256.104 5175.66 247.385 5147.79 241.717 5162.6C236.05 5177.41 231.255 5144.74 226.459 5159.55C221.664 5174.36 221.228 5173.49 217.305 5172.18C213.381 5170.87 218.176 5165.21 207.714 5159.11C197.251 5153.02 203.786 5175.23 192.453 5160.42C181.121 5145.61 185.481 5175.66 178.941 5172.18C172.402 5168.7 168.912 5160.42 168.912 5160.42C168.912 5160.42 167.607 5157.37 165.863 5157.37C164.119 5157.37 163.245 5160.42 163.245 5160.42C163.245 5160.42 163.245 5169.57 156.706 5168.7C150.167 5167.82 151.039 5160.42 151.039 5160.42V5143Z"
              fill="#74CCEA"
            />
            <path
              id="Rectangle 353"
              d="M174.945 5157.47C175.05 5156.07 176.219 5155 177.624 5155C179.16 5155 180.391 5156.25 180.342 5157.78C180.002 5168.51 178.914 5206.71 180.633 5208C182.51 5209.41 180.687 5249.6 180.457 5254.51C180.442 5254.84 180.366 5255.15 180.234 5255.45L180.108 5255.74C179.219 5257.76 176.358 5257.76 175.469 5255.74C175.257 5255.26 175.198 5254.73 175.297 5254.21C176.201 5249.47 180.641 5224.35 176.466 5209C172.559 5194.64 174.307 5166.03 174.945 5157.47Z"
              fill="#74CDE8"
            />
            <path
              id="Rectangle 356"
              d="M219.428 5161.45C219.308 5160.05 218.131 5159 216.723 5159C215.179 5159 213.934 5160.26 213.953 5161.81C214.074 5171.57 214.174 5203.81 210.366 5211C206.08 5219.09 213.165 5255.28 213.855 5258.74C213.894 5258.93 213.948 5259.09 214.028 5259.27L214.218 5259.7C215.113 5261.73 217.995 5261.73 218.89 5259.7C219.092 5259.24 219.158 5258.75 219.078 5258.26C218.254 5253.12 213.638 5222.54 217.867 5207C221.709 5192.88 220.088 5169.1 219.428 5161.45Z"
              fill="#74CDE8"
            />
            <path
              id="Rectangle 358"
              d="M261.239 5161.26C261.063 5159.95 259.932 5159 258.606 5159C257.054 5159 255.807 5160.28 255.829 5161.83C255.922 5168.52 255.788 5185.05 252.328 5188.92C248.307 5193.43 254.604 5213.06 255.627 5216.14C255.72 5216.42 255.854 5216.67 256.03 5216.9L256.454 5217.48C257.389 5218.73 259.273 5218.73 260.208 5217.48C260.642 5216.89 260.783 5216.15 260.6 5215.44C259.477 5211.1 255.746 5195.03 259.605 5186.62C263.117 5178.97 261.924 5166.38 261.239 5161.26Z"
              fill="#74CDE8"
            />
            <path
              id="Ellipse 123"
              d="M288.5 5103.5C288.5 5119.94 289.23 5134.34 274.5 5144.5C261.762 5153.29 226.442 5148 208.002 5148C188.579 5148 154.954 5153.14 142.003 5143.5C128.439 5133.41 129.003 5119.68 129.003 5104C129.003 5073.35 168.237 5034 208.002 5034C247.766 5034 288.5 5072.85 288.5 5103.5Z"
              fill="#9DD5EE"
            />
            <path
              id="Vector 144"
              d="M155.997 5089.31C162.5 5081.09 171.251 5079.97 178.731 5089.47"
              stroke="#464646"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <path
              id="Vector 147"
              d="M257.284 5087.31C250.781 5079.09 242.031 5077.97 234.55 5087.47"
              stroke="#464646"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <path
              id="Vector 145"
              d="M164.948 5101.16C164.948 5101.16 165.283 5110.85 176.019 5110.47C186.755 5110.09 186.93 5100.39 186.93 5100.39"
              stroke="#464646"
              strokeWidth={5}
              strokeLinecap="round"
            />
            <path
              id="Vector 148"
              d="M248.333 5099.16C248.333 5099.16 247.998 5108.85 237.262 5108.47C226.526 5108.09 226.351 5098.39 226.351 5098.39"
              stroke="#464646"
              strokeWidth={5}
              strokeLinecap="round"
            />
            <path
              id="Vector 146"
              d="M197.616 5126.68C197.616 5126.68 202.986 5134.5 208.743 5135C214.5 5135.5 219.87 5127.07 219.87 5127.07"
              stroke="#464646"
              strokeWidth={5}
              strokeLinecap="round"
            />
            <ellipse
              id="Ellipse 124"
              cx={174}
              cy={5124}
              rx={11}
              ry={4}
              fill="#FDCDE3"
            />
            <ellipse
              id="Ellipse 125"
              cx={246}
              cy={5124}
              rx={11}
              ry={4}
              fill="#FDCDE3"
            />
          </g>
          <g id="fish-small_24">
            <path
              id="Subtract_24"
              d="M166.7 4365.92H183.508V4363C183.508 4363.97 182.254 4364.76 180.707 4364.76C179.166 4364.76 177.916 4363.98 177.906 4363.01C177.896 4363.98 176.646 4364.76 175.105 4364.76C173.559 4364.76 172.305 4363.97 172.305 4363V4363H172.303V4363C172.303 4363.97 171.048 4364.76 169.501 4364.76C167.954 4364.76 166.7 4363.97 166.7 4363V4365.92Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_24"
              d="M160.569 4372.36C161.249 4372 161.282 4371.04 160.629 4370.63L154.829 4367.01C154.177 4366.6 153.327 4367.05 153.3 4367.82L153.061 4374.65C153.035 4375.42 153.851 4375.93 154.53 4375.57L160.569 4372.36Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_24"
              cx={17.538}
              cy={7.30752}
              rx={17.538}
              ry={7.30752}
              transform="matrix(-1 0 0 1 193 4364.46)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_24"
              cx={1.4615}
              cy={1.4615}
              r={1.4615}
              transform="matrix(-1 0 0 1 187.883 4368.12)"
              fill="#57657B"
            />
          </g>
          <g id="fish-small_25">
            <path
              id="Subtract_25"
              d="M262.574 4396C262.574 4397.03 261.248 4397.86 259.612 4397.86C257.989 4397.86 256.671 4397.04 256.651 4396.03V4399.09H274.422V4396C274.422 4397.03 273.096 4397.86 271.46 4397.86C269.837 4397.86 268.519 4397.04 268.499 4396.03C268.479 4397.04 267.162 4397.86 265.538 4397.86C263.902 4397.86 262.576 4397.03 262.576 4396V4396H262.574V4396Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_25"
              d="M250.268 4405.86C250.948 4405.49 250.982 4404.53 250.329 4404.12L244.028 4400.19C243.375 4399.78 242.525 4400.23 242.498 4401L242.239 4408.43C242.212 4409.2 243.028 4409.7 243.708 4409.34L250.268 4405.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_25"
              cx={18.5437}
              cy={7.72653}
              rx={18.5437}
              ry={7.72653}
              transform="matrix(-1 0 0 1 284.469 4397.55)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_25"
              cx={1.54531}
              cy={1.54531}
              r={1.54531}
              transform="matrix(-1 0 0 1 279.055 4401.41)"
              fill="#57657B"
            />
          </g>
          <g id="fish-small_26">
            <path
              id="Subtract_26"
              d="M1128.89 4819C1128.89 4820.03 1130.22 4820.86 1131.86 4820.86C1133.48 4820.86 1134.8 4820.04 1134.82 4819.03V4822.09H1117.05V4819C1117.05 4820.03 1118.37 4820.86 1120.01 4820.86C1121.63 4820.86 1122.95 4820.04 1122.97 4819.03C1122.99 4820.04 1124.31 4820.86 1125.93 4820.86C1127.57 4820.86 1128.89 4820.03 1128.89 4819V4819H1128.89V4819Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_26"
              d="M1141.2 4828.86C1140.52 4828.49 1140.49 4827.53 1141.14 4827.12L1147.44 4823.19C1148.09 4822.78 1148.94 4823.23 1148.97 4824L1149.23 4831.43C1149.26 4832.2 1148.44 4832.7 1147.76 4832.34L1141.2 4828.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_26"
              cx={1125.54}
              cy={4828.27}
              rx={18.5437}
              ry={7.72653}
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_26"
              cx={1113.96}
              cy={4825.95}
              r={1.54531}
              fill="#57657B"
            />
          </g>
          <g id="fish-small_27">
            <path
              id="Subtract_27"
              d="M937.245 4864C937.245 4865.23 938.834 4866.23 940.795 4866.23C942.69 4866.23 944.238 4865.3 944.339 4864.13V4867.7H923.039V4864C923.039 4865.23 924.628 4866.23 926.589 4866.23C928.538 4866.23 930.119 4865.24 930.138 4864.03C930.157 4865.24 931.738 4866.23 933.687 4866.23C935.647 4866.23 937.236 4865.23 937.236 4864C937.236 4864 937.236 4864 937.236 4864H937.245C937.245 4864 937.245 4864 937.245 4864Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_27"
              d="M951.688 4875.65C951.008 4875.29 950.975 4874.33 951.628 4873.92L959.763 4868.84C960.416 4868.43 961.266 4868.88 961.293 4869.65L961.628 4879.24C961.654 4880.01 960.838 4880.52 960.159 4880.16L951.688 4875.65Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_27"
              cx={933.226}
              cy={4875.11}
              rx={22.2263}
              ry={9.26097}
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_27"
              cx={919.344}
              cy={4872.33}
              r={1.85219}
              fill="#57657B"
            />
          </g>
          <g id="fish-small_28">
            <path
              id="Subtract_28"
              d="M327.566 4535C327.566 4536.03 326.24 4536.86 324.604 4536.86C322.981 4536.86 321.663 4536.04 321.644 4535.03V4538.09H339.414V4535C339.414 4536.03 338.088 4536.86 336.452 4536.86C334.829 4536.86 333.511 4536.04 333.491 4535.03C333.471 4536.04 332.154 4536.86 330.53 4536.86C328.894 4536.86 327.568 4536.03 327.568 4535V4535H327.566V4535Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_28"
              d="M315.261 4544.86C315.94 4544.49 315.974 4543.53 315.321 4543.12L309.02 4539.19C308.367 4538.78 307.518 4539.23 307.491 4540L307.231 4547.43C307.204 4548.2 308.02 4548.7 308.7 4548.34L315.261 4544.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_28"
              cx={18.5437}
              cy={7.72653}
              rx={18.5437}
              ry={7.72653}
              transform="matrix(-1 0 0 1 349.461 4536.55)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_28"
              cx={1.54531}
              cy={1.54531}
              r={1.54531}
              transform="matrix(-1 0 0 1 344.047 4540.41)"
              fill="#57657B"
            />
          </g>
          <g id="fish-small_29">
            <path
              id="Subtract_29"
              d="M824.566 5017C824.566 5018.03 823.24 5018.86 821.604 5018.86C819.981 5018.86 818.663 5018.04 818.644 5017.03V5020.09H836.414V5017C836.414 5018.03 835.088 5018.86 833.452 5018.86C831.829 5018.86 830.511 5018.04 830.491 5017.03C830.471 5018.04 829.154 5018.86 827.53 5018.86C825.894 5018.86 824.568 5018.03 824.568 5017V5017H824.566V5017Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_29"
              d="M812.261 5026.86C812.94 5026.49 812.974 5025.53 812.321 5025.12L806.02 5021.19C805.367 5020.78 804.518 5021.23 804.491 5022L804.231 5029.43C804.204 5030.2 805.02 5030.7 805.7 5030.34L812.261 5026.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_29"
              cx={18.5437}
              cy={7.72653}
              rx={18.5437}
              ry={7.72653}
              transform="matrix(-1 0 0 1 846.461 5018.55)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_29"
              cx={1.54531}
              cy={1.54531}
              r={1.54531}
              transform="matrix(-1 0 0 1 841.047 5022.41)"
              fill="#57657B"
            />
          </g>
          <g id="fish-small_30">
            <path
              id="Subtract_30"
              d="M134.566 4775C134.566 4776.03 133.24 4776.86 131.604 4776.86C129.981 4776.86 128.663 4776.04 128.644 4775.03V4778.09H146.414V4775C146.414 4776.03 145.088 4776.86 143.452 4776.86C141.829 4776.86 140.511 4776.04 140.491 4775.03C140.471 4776.04 139.154 4776.86 137.53 4776.86C135.894 4776.86 134.568 4776.03 134.568 4775V4775H134.566V4775Z"
              fill="#3C6B8C"
            />
            <path
              id="Polygon 9_30"
              d="M122.261 4784.86C122.94 4784.49 122.974 4783.53 122.321 4783.12L116.02 4779.19C115.367 4778.78 114.518 4779.23 114.491 4780L114.231 4787.43C114.204 4788.2 115.02 4788.7 115.7 4788.34L122.261 4784.86Z"
              fill="#3C6B8C"
            />
            <ellipse
              id="Ellipse 107_30"
              cx={18.5437}
              cy={7.72653}
              rx={18.5437}
              ry={7.72653}
              transform="matrix(-1 0 0 1 156.461 4776.55)"
              fill="#3C6B8C"
            />
            <circle
              id="Ellipse 108_30"
              cx={1.54531}
              cy={1.54531}
              r={1.54531}
              transform="matrix(-1 0 0 1 151.047 4780.41)"
              fill="#57657B"
            />
          </g>
          <g id="message-bubble">
            <rect
              id="Rectangle 359"
              x={245}
              y={4851}
              width={348}
              height={171}
              rx={49}
              fill="white"
            />
            <path
              id="Polygon 10"
              d="M264.5 5045L311.586 5019H280.409L264.5 5045Z"
              fill="white"
            />
            <path
              id="HELLO"
              d="M320.591 4960V4913.45H329.023V4933.16H350.591V4913.45H359.045V4960H350.591V4940.23H329.023V4960H320.591ZM368.216 4960V4913.45H398.489V4920.52H376.648V4933.16H396.92V4940.23H376.648V4952.93H398.67V4960H368.216ZM407.091 4960V4913.45H415.523V4952.93H436.023V4960H407.091ZM443.341 4960V4913.45H451.773V4952.93H472.273V4960H443.341ZM519.369 4936.73C519.369 4941.74 518.43 4946.04 516.551 4949.61C514.688 4953.17 512.142 4955.9 508.915 4957.8C505.703 4959.69 502.059 4960.64 497.983 4960.64C493.907 4960.64 490.256 4959.69 487.028 4957.8C483.816 4955.89 481.271 4953.15 479.392 4949.59C477.528 4946.02 476.597 4941.73 476.597 4936.73C476.597 4931.71 477.528 4927.42 479.392 4923.86C481.271 4920.29 483.816 4917.55 487.028 4915.66C490.256 4913.77 493.907 4912.82 497.983 4912.82C502.059 4912.82 505.703 4913.77 508.915 4915.66C512.142 4917.55 514.688 4920.29 516.551 4923.86C518.43 4927.42 519.369 4931.71 519.369 4936.73ZM510.892 4936.73C510.892 4933.2 510.339 4930.22 509.233 4927.8C508.142 4925.36 506.627 4923.52 504.688 4922.27C502.748 4921.02 500.513 4920.39 497.983 4920.39C495.453 4920.39 493.218 4921.02 491.278 4922.27C489.339 4923.52 487.816 4925.36 486.71 4927.8C485.619 4930.22 485.074 4933.2 485.074 4936.73C485.074 4940.26 485.619 4943.24 486.71 4945.68C487.816 4948.11 489.339 4949.95 491.278 4951.2C493.218 4952.45 495.453 4953.07 497.983 4953.07C500.513 4953.07 502.748 4952.45 504.688 4951.2C506.627 4949.95 508.142 4948.11 509.233 4945.68C510.339 4943.24 510.892 4940.26 510.892 4936.73Z"
              fill="#4D4D4D"
            />
          </g>
          <g id="treasure">
            <g id="Rectangle 363">
              <mask id="path-285-inside-1_3773_9894" fill="white">
                <path d="M310 6381.55H494V6498.03C494 6499.14 493.105 6500.03 492 6500.03H312C310.895 6500.03 310 6499.14 310 6498.03V6381.55Z" />
              </mask>
              <path
                d="M310 6381.55H494V6498.03C494 6499.14 493.105 6500.03 492 6500.03H312C310.895 6500.03 310 6499.14 310 6498.03V6381.55Z"
                fill="#7D5D4B"
                stroke="#564949"
                strokeWidth={24}
                mask="url(#path-285-inside-1_3773_9894)"
              />
            </g>
            <circle
              id="Ellipse 126"
              cx={318.358}
              cy={6391.3}
              r={2.78788}
              fill="#D9D9D9"
            />
            <circle
              id="Ellipse 128"
              cx={485.639}
              cy={6391.3}
              r={2.78788}
              fill="#D9D9D9"
            />
            <circle
              id="Ellipse 127"
              cx={318.358}
              cy={6490.27}
              r={2.78788}
              fill="#D9D9D9"
            />
            <circle
              id="Ellipse 129"
              cx={485.639}
              cy={6490.27}
              r={2.78788}
              fill="#D9D9D9"
            />
            <path
              id="Rectangle 364"
              d="M330 6325H474C483.941 6325 492 6333.06 492 6343V6379.55H312V6343C312 6333.21 319.809 6325.25 329.535 6325.01L330 6325Z"
              fill="#7D5D4B"
              stroke="#C2C2C2"
              strokeWidth={4}
            />
            <path
              id="Vector 149"
              d="M326.727 6416.39H477.272"
              stroke="#C2C2C2"
              strokeOpacity={0.5}
              strokeWidth={3}
            />
            <path
              id="Vector 150"
              d="M326.727 6437.3H477.272"
              stroke="#C2C2C2"
              strokeOpacity={0.5}
              strokeWidth={3}
            />
            <path
              id="Vector 151"
              d="M326.727 6458.21H477.272"
              stroke="#C2C2C2"
              strokeOpacity={0.5}
              strokeWidth={3}
            />
            <path
              id="Vector 152"
              d="M337.875 6328.59L337.875 6375.98"
              stroke="#564949"
              strokeWidth={3}
            />
            <path
              id="Vector 153"
              d="M365.75 6328.59L365.75 6375.98"
              stroke="#564949"
              strokeWidth={3}
            />
            <path
              id="Vector 156"
              d="M438.25 6328.59L438.25 6375.98"
              stroke="#564949"
              strokeWidth={3}
            />
            <path
              id="Vector 157"
              d="M466.125 6328.59L466.125 6375.98"
              stroke="#564949"
              strokeWidth={3}
            />
            <g id="padlock">
              <rect
                id="Rectangle 365"
                x={391.352}
                y={6368.1}
                width={22.697}
                height={22.697}
                rx={3.5}
                fill="#FAFAFA"
                stroke="#BABAAF"
              />
              <g id="keyhole">
                <circle
                  id="Ellipse 130"
                  cx={402.7}
                  cy={6378.07}
                  r={2.09091}
                  fill="#555555"
                />
                <path
                  id="Polygon 11"
                  d="M402.699 6378.77L406.924 6386.08H398.474L402.699 6378.77Z"
                  fill="#555555"
                />
              </g>
            </g>
          </g>
          <g id="shipwreck">
            <path
              id="Union_3"
              d="M1223.26 5879.25L1210.5 5933.38L1186.22 5928.22L1184.92 5962.39L1202.76 5966.18L1105.05 6380.57L1030.64 6372.22L950.212 6329.29L853.68 6311.3L857.546 6287.25C857.575 6287.18 861.204 6277.63 834.943 6272.05C808.67 6266.47 809.753 6277.02 809.76 6277.1L801.913 6301.65L753.075 6292.55L647.867 6258.55L648.349 6253.69L629.861 6243.44L616.679 6240.63L613.614 6247.11C569.507 6231.47 426.253 6180.67 425.221 6180.44C424.071 6180.2 421.089 6196.32 422.447 6196.32C423.54 6196.34 537.507 6245.05 591.938 6268.33C588.677 6298.99 592.917 6351.55 645.246 6397.71C724.958 6468.03 1415.14 6597.31 1468.56 6572.72C1521.91 6548.15 1568.25 6387.03 1568.36 6386.63L1551.22 6384.08L1566.58 6358.51L1406.4 6264.64L1374.2 6278.04L1356.25 6251.97L1296.27 6408.24L1216.32 6422.37L1174.91 6382.22L1141.78 6382.01L1221.19 5970.1L1240.95 5974.3L1253.66 5942.55L1227.57 5937.01L1238.09 5882.4L1233.01 5865.82L1223.26 5879.25ZM1549.94 6383.89L1503.25 6376.94C1503.17 6377.07 1486.94 6399.92 1459.76 6406.6C1432.55 6413.28 1393.87 6401.22 1393.75 6401.18L1370.51 6437.57L1333.17 6422.65L1463.07 6331.69L1549.94 6383.89ZM1453.58 6325.99L1325.55 6415.65L1375.7 6280.22L1374.5 6278.48L1453.58 6325.99Z"
              fill="#072154"
            />
            <path
              id="Union_4"
              d="M1060.51 6030.64C1059.43 6030.41 1058.37 6031.1 1058.14 6032.18L1056.17 6041.45C1055.94 6042.53 1056.63 6043.59 1057.71 6043.82L1071.49 6046.75C1073.83 6051.48 1076.84 6057.48 1079.93 6063.51C1083.28 6070.03 1086.74 6076.59 1089.57 6081.56C1090.98 6084.04 1092.24 6086.14 1093.25 6087.64C1093.76 6088.39 1094.21 6089 1094.59 6089.44C1094.79 6089.66 1094.97 6089.85 1095.14 6089.99C1095.31 6090.12 1095.51 6090.26 1095.73 6090.31C1096.42 6090.45 1096.97 6090.05 1097.35 6089.54C1097.74 6089.03 1098.08 6088.29 1098.38 6087.44C1098.99 6085.73 1099.54 6083.39 1100.14 6081.07C1100.75 6078.72 1101.41 6076.37 1102.24 6074.58C1102.65 6073.68 1103.09 6072.95 1103.57 6072.44C1104.05 6071.92 1104.53 6071.65 1105.04 6071.59C1105.42 6071.55 1105.94 6071.81 1106.63 6072.67C1107.29 6073.5 1107.99 6074.73 1108.72 6076.26C1110.18 6079.33 1111.71 6083.45 1113.32 6087.57C1114.92 6091.67 1116.59 6095.78 1118.34 6098.74C1119.21 6100.22 1120.11 6101.45 1121.06 6102.25C1122.02 6103.06 1123.08 6103.49 1124.21 6103.19C1126.23 6102.67 1128 6100.72 1129.57 6098.27C1131.16 6095.8 1132.64 6092.69 1134.04 6089.65C1135.44 6086.6 1136.77 6083.63 1138.07 6081.38C1138.72 6080.26 1139.36 6079.34 1139.97 6078.69C1140.6 6078.03 1141.15 6077.7 1141.64 6077.65C1141.79 6077.63 1142.06 6077.69 1142.47 6077.97C1142.88 6078.25 1143.35 6078.68 1143.89 6079.26C1144.96 6080.42 1146.23 6082.13 1147.64 6084.22C1150.45 6088.38 1153.77 6093.97 1157.12 6099.53C1160.45 6105.08 1163.82 6110.6 1166.7 6114.6C1168.14 6116.59 1169.47 6118.23 1170.64 6119.3C1171.23 6119.83 1171.79 6120.25 1172.33 6120.49C1172.86 6120.74 1173.42 6120.83 1173.95 6120.62C1174.78 6120.29 1175.57 6119.56 1176.33 6118.61C1177.09 6117.65 1177.86 6116.42 1178.6 6115.03C1180.09 6112.25 1181.53 6108.76 1182.8 6105.36C1184.06 6101.96 1185.15 6098.63 1185.92 6096.15C1186.3 6094.95 1186.59 6093.95 1186.8 6093.24C1186.83 6093.28 1186.85 6093.33 1186.87 6093.37C1187.3 6094.16 1187.91 6095.28 1188.68 6096.6C1190.22 6099.25 1192.4 6102.75 1194.94 6106.1C1197.47 6109.45 1200.38 6112.69 1203.39 6114.81C1206.39 6116.93 1209.6 6118.01 1212.65 6116.79C1218.54 6114.45 1221.14 6108.31 1222.29 6102.92C1222.87 6100.21 1223.09 6097.64 1223.17 6095.75C1223.18 6095.35 1223.19 6094.97 1223.2 6094.64C1223.22 6094.67 1223.24 6094.71 1223.26 6094.75C1223.91 6095.92 1224.85 6097.6 1225.98 6099.6C1228.25 6103.61 1231.32 6108.95 1234.5 6114.26C1237.68 6119.56 1240.97 6124.85 1243.71 6128.75C1245.08 6130.7 1246.31 6132.32 1247.33 6133.43C1247.83 6133.98 1248.3 6134.42 1248.72 6134.72C1248.93 6134.86 1249.14 6134.98 1249.35 6135.06C1249.56 6135.13 1249.8 6135.17 1250.04 6135.11C1250.43 6135 1250.74 6134.7 1250.99 6134.36C1251.23 6134.02 1251.46 6133.56 1251.68 6133.03C1252.1 6131.97 1252.5 6130.53 1252.89 6128.86C1253.46 6126.34 1254.01 6123.24 1254.55 6120.01L1255.62 6113.49C1256.16 6110.27 1256.7 6107.2 1257.27 6104.71C1257.65 6103.05 1258.03 6101.67 1258.43 6100.68C1258.63 6100.19 1258.82 6099.82 1259.01 6099.56C1259.18 6099.33 1259.3 6099.24 1259.37 6099.21C1259.38 6099.22 1259.39 6099.22 1259.41 6099.23C1259.49 6099.28 1259.61 6099.37 1259.76 6099.53C1260.07 6099.84 1260.44 6100.36 1260.88 6101.07C1261.75 6102.47 1262.8 6104.55 1264 6107.09C1266.38 6112.16 1269.28 6119.01 1272.24 6125.88C1275.19 6132.75 1278.2 6139.65 1280.8 6144.79C1282.1 6147.36 1283.31 6149.51 1284.37 6151.01C1284.9 6151.75 1285.41 6152.36 1285.88 6152.77C1286.34 6153.17 1286.87 6153.47 1287.41 6153.41C1287.71 6153.38 1287.97 6153.23 1288.19 6153.05C1288.41 6152.87 1288.61 6152.62 1288.8 6152.34C1289.19 6151.77 1289.58 6150.98 1289.96 6150.03C1290.73 6148.11 1291.52 6145.42 1292.32 6142.23C1293.92 6135.85 1295.55 6127.41 1297.02 6119C1298.48 6110.58 1299.78 6102.19 1300.71 6095.9C1300.73 6095.76 1300.75 6095.63 1300.78 6095.49L1307.55 6096.93C1308.63 6097.16 1309.7 6096.47 1309.93 6095.39L1311.9 6086.12C1312.13 6085.04 1311.44 6083.98 1310.36 6083.75L1060.51 6030.64Z"
              fill="#1E3561"
            />
            <path
              id="Union_5"
              d="M1036.29 6177.05C1035.21 6176.82 1034.15 6177.51 1033.92 6178.59L1031.95 6187.86C1031.72 6188.94 1032.41 6190 1033.49 6190.23L1036.12 6190.79L1033.76 6201.9C1035.17 6201.38 1036.62 6201.23 1038.05 6201.54C1043.93 6202.79 1047.12 6211.18 1045.19 6220.28C1043.25 6229.38 1036.92 6235.74 1031.04 6234.49C1029.62 6234.19 1028.35 6233.46 1027.27 6232.41L1011.41 6307.03C1010.98 6309.07 1013.1 6310.72 1014.97 6309.79L1092.54 6271.26C1093.66 6270.7 1094.93 6271.68 1094.67 6272.91L1090.59 6292.11C1090.08 6294.52 1093 6296.14 1094.78 6294.43L1122.42 6267.66C1123.28 6266.84 1124.71 6267.29 1124.94 6268.46L1133.19 6311.23C1133.58 6313.24 1136.09 6313.96 1137.49 6312.46L1156.93 6291.42C1154.7 6289.38 1153.66 6285.49 1154.53 6281.4C1155.69 6275.94 1159.81 6272.19 1163.73 6273.02C1166.19 6273.54 1167.99 6275.76 1168.7 6278.69L1182.91 6263.31C1183.71 6262.45 1185.15 6262.8 1185.46 6263.94L1195.19 6299.64C1195.65 6301.35 1197.7 6302.04 1199.11 6300.97L1221.6 6283.86C1222.29 6283.34 1223.27 6283.51 1223.75 6284.23L1246.64 6318.61C1247.86 6320.46 1250.7 6319.91 1251.16 6317.75L1256.58 6292.28C1256.85 6291 1258.52 6290.66 1259.27 6291.73L1287.66 6332.12C1289.16 6334.24 1292.5 6332.96 1292.19 6330.38L1281.81 6243.01L1283.33 6243.34C1284.41 6243.57 1285.48 6242.88 1285.71 6241.8L1287.68 6232.53C1287.91 6231.45 1287.22 6230.39 1286.13 6230.16L1036.29 6177.05Z"
              fill="#1E3561"
            />
          </g>
          <path
            id="Union_6"
            d="M834.667 6385.66C836.324 6381.93 837.511 6379.33 838.604 6380.87C838.943 6381.35 839.157 6381.98 839.271 6382.76C840.381 6383.46 840.767 6384.91 840.122 6386.08L840.121 6386.08C840.12 6386.08 840.119 6386.08 840.118 6386.09C840.115 6386.09 840.11 6386.1 840.104 6386.11C840.091 6386.14 840.07 6386.17 840.043 6386.22C839.989 6386.32 839.909 6386.47 839.806 6386.66C839.615 6387.01 839.344 6387.51 839.014 6388.13C838.465 6391.65 837.354 6396.06 836.159 6400.93C834.327 6408.4 829.355 6402.46 829.991 6414.57C830.626 6426.68 825.105 6432.77 822.64 6436.72C821.054 6439.25 820.827 6442.3 820.405 6444.97C821.641 6443.6 822.518 6442.06 822.69 6440.35C823.445 6432.81 830.122 6435.73 834.177 6432.98C834.351 6432.86 834.508 6432.74 834.654 6432.61C835.041 6431.12 835.332 6429.61 836.176 6427.91C836.113 6425.85 835.861 6423.71 837.542 6422.08C840.775 6418.93 839.778 6421.16 844.587 6418.5C844.735 6418.42 844.88 6418.34 845.026 6418.25C846.032 6417.39 847.03 6416.57 847.967 6415.81C849.623 6414.48 851.13 6413.32 852.224 6412.49C852.771 6412.08 853.216 6411.75 853.525 6411.52C853.609 6411.46 853.683 6411.41 853.746 6411.36C855.289 6410.12 856.41 6409.56 857.023 6410.54C857.204 6410.83 857.305 6411.15 857.338 6411.52C857.396 6411.59 857.452 6411.65 857.504 6411.73C858.313 6412.84 858.061 6414.41 856.943 6415.22L856.83 6415.3C856.754 6415.35 856.64 6415.44 856.492 6415.55C856.298 6415.69 856.046 6415.88 855.746 6416.1C854.426 6418.38 852.426 6421.1 850.26 6424.09C846.764 6428.93 842.716 6423.59 840.876 6432.26C839.037 6440.94 831.908 6443.94 828.47 6446.15C824.801 6448.5 824.822 6452.72 821.802 6454.28C820.36 6455.02 818.709 6455.44 817.073 6455.62C817.067 6455.63 817.062 6455.63 817.058 6455.63C817.056 6455.64 817.053 6455.64 817.051 6455.64L817.049 6455.64L817.049 6455.64C817.049 6455.64 817.049 6455.64 817.034 6455.63L817.033 6455.63L817.048 6455.64C816.304 6456.28 815.291 6456.41 814.443 6456.05C813.444 6456.11 812.249 6456.05 810.946 6455.87C810.3 6456.37 809.422 6456.54 808.592 6456.25L808.591 6456.26L808.59 6456.25L808.588 6456.25C808.586 6456.25 808.583 6456.25 808.579 6456.25C808.572 6456.25 808.56 6456.24 808.547 6456.24C808.52 6456.23 808.48 6456.22 808.429 6456.2C808.326 6456.16 808.176 6456.11 807.987 6456.04C807.769 6455.96 807.498 6455.86 807.182 6455.74C804.688 6455.97 802.169 6455.98 800.001 6455.67C795.645 6455.03 795.895 6451.58 790.627 6450.43C785.692 6449.36 775.377 6448.41 773.123 6441.71C770.869 6435.01 764.649 6440.22 759.763 6437.01C756.746 6435.03 753.958 6433.24 752.136 6431.66C752.106 6431.65 752.081 6431.64 752.063 6431.64C752.049 6431.64 752.039 6431.63 752.032 6431.63C752.029 6431.63 752.026 6431.63 752.024 6431.63L752.023 6431.63C750.944 6431.34 750.217 6430.39 750.166 6429.33C749.85 6428.61 749.931 6427.95 750.532 6427.36C750.97 6426.94 751.55 6426.75 752.264 6426.74C752.601 6426.69 752.954 6426.7 753.305 6426.8L753.293 6426.84L753.294 6426.84L753.306 6426.8C753.307 6426.8 753.309 6426.8 753.31 6426.8C753.312 6426.8 753.315 6426.8 753.318 6426.8C753.326 6426.8 753.339 6426.8 753.354 6426.81C753.385 6426.82 753.43 6426.83 753.488 6426.84C753.596 6426.87 753.75 6426.91 753.945 6426.97C754.382 6427.07 754.85 6427.2 755.347 6427.36C755.505 6427.4 755.673 6427.45 755.847 6427.5C757.403 6427.94 759.549 6428.57 761.903 6429.3C763.516 6429.81 765.256 6430.38 766.987 6430.98C767.445 6431.08 767.911 6431.17 768.384 6431.25C775.311 6432.4 773.961 6430.79 778.547 6432.68C783.133 6434.56 777.1 6439.48 782.925 6440.87C786.069 6441.63 790.423 6440.86 793.874 6440.95C793.405 6439.97 792.767 6439 791.84 6438.06C787.858 6434.01 778.937 6427.45 779.98 6416.46C781.024 6405.47 772.975 6410.04 770.022 6402.87C767.805 6397.49 765.765 6392.68 765.085 6389.2C764.632 6388.51 764.559 6387.65 764.85 6386.91C764.873 6385.61 765.246 6384.63 766.093 6384.05C769.258 6381.87 772.89 6391.86 780.501 6398.7C786.253 6403.86 785.77 6400.82 789.062 6405.89C792.354 6410.96 784.614 6415.17 789.258 6420.14C793.892 6425.09 804.673 6424.49 802.563 6433.68C801.776 6437.1 803.893 6440.77 806.736 6444.12C807.146 6441.36 807.973 6438.26 807.217 6435.23C806.091 6430.71 802.722 6423.21 807.069 6411.89C811.416 6400.57 804.852 6404.68 805.417 6397.01C805.787 6392.01 806.092 6387.46 806.657 6383.95C806.535 6383.26 806.435 6382.7 806.362 6382.31C806.323 6382.1 806.292 6381.93 806.271 6381.82C806.26 6381.77 806.252 6381.72 806.247 6381.7C806.244 6381.68 806.243 6381.67 806.242 6381.67C806.241 6381.67 806.24 6381.66 806.24 6381.66L806.24 6381.66C805.987 6380.35 806.801 6379.09 808.074 6378.76C808.421 6378.06 808.822 6377.53 809.291 6377.18C810.802 6376.06 811.13 6378.87 811.551 6382.92C811.571 6383.03 811.593 6383.14 811.614 6383.26C811.889 6384.84 812.254 6387.04 812.614 6389.53C812.735 6390.36 812.852 6391.22 812.969 6392.11C813.09 6392.58 813.222 6393.05 813.367 6393.5C815.224 6399.31 815.946 6396.11 816.299 6401.63C816.473 6404.36 815.024 6406.67 813.669 6408.97C813.233 6411.76 812.387 6413.8 811.572 6416.15C811.589 6416.24 811.608 6416.34 811.629 6416.43C812.427 6420 815.631 6421.35 816.574 6424.42C818.209 6420.95 822.2 6420.95 824.252 6417.48C824.301 6417.4 824.346 6417.31 824.391 6417.23C824.343 6414.74 824.169 6412.55 824.617 6409.76C824.039 6407.15 823.373 6404.51 824.384 6401.96C826.424 6396.82 826.123 6400.08 829.683 6395.13C829.965 6394.74 830.237 6394.34 830.501 6393.92C830.884 6393.12 831.261 6392.34 831.629 6391.59C832.741 6389.34 833.768 6387.36 834.517 6385.94C834.568 6385.84 834.618 6385.75 834.667 6385.66ZM815.958 6430.2C815.794 6430.62 815.605 6431.06 815.388 6431.52C814.119 6434.22 813.883 6437.2 814.142 6440.12C815.52 6437.18 816.428 6433.95 816.013 6430.67C815.993 6430.51 815.974 6430.35 815.958 6430.2Z"
            fill="#0B172D"
          />
          <path
            id="Rectangle 361"
            d="M0 6494C0 6494 671.5 6411.5 904.5 6412C1137.5 6412.5 1237.15 6465.15 1441 6494V6738H0V6494Z"
            fill="#1E4761"
          />
          <path
            id="Union_7"
            d="M1418.99 6482.54C1427.76 6470.34 1431.96 6450.84 1435.6 6455.97C1439.19 6461.03 1435.41 6475.52 1431.05 6493.33C1427.63 6507.24 1418.37 6496.18 1419.56 6518.73C1420.74 6541.28 1410.46 6552.63 1405.87 6559.98C1402.91 6564.7 1402.49 6570.37 1401.71 6575.34C1404.01 6572.79 1405.64 6569.92 1405.96 6566.74C1407.36 6552.71 1419.8 6558.13 1427.35 6553.01C1434.92 6547.88 1427.59 6538.57 1433.62 6532.71C1439.64 6526.86 1437.78 6531.01 1446.74 6526.06C1458.59 6519.51 1467.09 6506.76 1469.9 6511.22C1472.66 6515.61 1465.64 6524.95 1457.3 6536.47C1450.79 6545.47 1443.25 6535.52 1439.83 6551.68C1436.4 6567.84 1423.12 6573.44 1416.72 6577.54C1409.89 6581.92 1409.93 6589.78 1404.3 6592.68C1401.25 6594.26 1397.69 6595.06 1394.24 6595.3C1391.57 6596.36 1386.41 6596.26 1380.59 6595.02C1374.86 6595.78 1368.77 6596.02 1363.71 6595.28C1355.6 6594.1 1356.06 6587.67 1346.25 6585.53C1337.06 6583.53 1317.85 6581.76 1313.65 6569.28C1309.46 6556.8 1297.87 6566.52 1288.77 6560.54C1277.13 6552.88 1267.3 6546.74 1271.58 6542.56C1275.92 6538.33 1287.76 6546.95 1304.83 6549.8C1317.73 6551.95 1315.21 6548.95 1323.75 6552.46C1332.3 6555.97 1321.06 6565.13 1331.91 6567.73C1337.76 6569.13 1345.87 6567.71 1352.29 6567.87C1351.42 6566.05 1350.23 6564.23 1348.5 6562.47C1341.08 6554.93 1324.47 6542.72 1326.41 6522.25C1328.36 6501.78 1313.37 6510.29 1307.87 6496.94C1300.83 6479.85 1294.74 6465.89 1300.55 6461.89C1306.45 6457.83 1313.21 6476.44 1327.38 6489.17C1338.1 6498.78 1337.2 6493.11 1343.33 6502.56C1349.46 6512 1335.04 6519.85 1343.69 6529.1C1352.32 6538.33 1372.4 6537.21 1368.47 6554.31C1367 6560.69 1370.95 6567.53 1376.24 6573.75C1377 6568.61 1378.55 6562.84 1377.14 6557.2C1375.04 6548.79 1368.77 6534.82 1376.86 6513.74C1384.96 6492.66 1372.73 6500.31 1373.79 6486.03C1375.14 6467.75 1376.03 6452.79 1381 6449.1C1386.05 6445.34 1384.01 6465.18 1388.59 6479.49C1392.05 6490.31 1393.39 6484.36 1394.05 6494.63C1394.71 6504.9 1383.06 6511.93 1385.35 6522.2C1386.84 6528.86 1392.81 6531.36 1394.57 6537.08C1397.61 6530.61 1405.05 6530.62 1408.87 6524.15C1414.22 6515.09 1405.32 6504.81 1409.12 6495.25C1412.92 6485.68 1412.35 6491.75 1418.99 6482.54ZM1393.42 6547.82C1393.12 6548.61 1392.76 6549.43 1392.36 6550.29C1389.99 6555.32 1389.55 6560.89 1390.04 6566.33C1392.61 6560.85 1394.3 6554.83 1393.53 6548.71C1393.49 6548.41 1393.45 6548.11 1393.42 6547.82Z"
            fill="#0B172D"
          />
          <g id="Group 129">
            <g id="Frame 1602">
              <path
                id="Rectangle 360"
                d="M0 6422.96C0 6422.96 186.236 6396.95 363.924 6534.47C541.611 6671.99 1151 6738 1151 6738H914.694H0V6422.96Z"
                fill="#1A2A41"
              />
              <path
                id="Union_8"
                d="M128.022 6437.52C118.418 6425.97 112.871 6406.81 109.597 6412.18C106.37 6417.47 111.146 6431.68 116.744 6449.13C121.118 6462.77 129.585 6451.09 129.977 6473.67C130.369 6496.25 141.418 6506.85 146.511 6513.86C149.785 6518.36 150.603 6524 151.734 6528.9C149.261 6526.51 147.435 6523.77 146.894 6520.61C144.512 6506.71 132.486 6512.99 124.595 6508.41C116.688 6503.82 123.343 6494.02 116.928 6488.6C110.513 6483.18 112.656 6487.19 103.375 6482.88C91.0952 6477.17 81.7206 6465.05 79.2371 6469.69C76.7894 6474.26 84.4435 6483.08 93.5612 6493.99C100.685 6502.52 107.511 6492.08 112.056 6507.95C116.601 6523.83 130.236 6528.49 136.908 6532.14C144.031 6536.03 144.538 6543.87 150.351 6546.37C153.509 6547.73 157.116 6548.29 160.574 6548.28C163.308 6549.16 168.455 6548.69 174.166 6547.06C179.943 6547.41 186.034 6547.22 191.031 6546.14C199.039 6544.39 198.126 6538.01 207.764 6535.19C216.792 6532.56 235.832 6529.45 239.149 6516.71C242.466 6503.96 254.7 6512.85 263.36 6506.25C274.443 6497.8 283.819 6490.99 279.256 6487.12C274.627 6483.2 263.424 6492.63 246.595 6496.66C233.877 6499.7 236.175 6496.53 227.899 6500.63C219.624 6504.73 231.472 6513.09 220.831 6516.43C215.09 6518.24 206.904 6517.39 200.505 6518C201.251 6516.12 202.31 6514.22 203.913 6512.35C210.784 6504.31 226.505 6490.97 223.139 6470.68C219.772 6450.4 235.319 6457.84 239.874 6444.14C245.703 6426.6 250.801 6412.25 244.727 6408.67C238.565 6405.03 233.116 6424.06 219.863 6437.75C209.848 6448.09 210.35 6442.37 204.893 6452.22C199.435 6462.06 214.363 6468.89 206.381 6478.72C198.415 6488.53 178.308 6488.81 183.422 6505.6C185.328 6511.86 181.873 6518.96 177.026 6525.54C175.906 6520.46 173.966 6514.81 174.976 6509.08C176.482 6500.55 181.765 6486.18 172.219 6465.71C162.673 6445.25 175.401 6452.03 173.354 6437.85C170.735 6419.71 168.803 6404.86 163.584 6401.51C158.288 6398.12 161.697 6417.77 158.131 6432.37C155.436 6443.4 153.679 6437.55 153.741 6447.85C153.804 6458.14 165.911 6464.34 164.34 6474.74C163.321 6481.49 157.536 6484.4 156.188 6490.23C152.701 6483.99 145.281 6484.51 141.017 6478.33C135.045 6469.67 143.211 6458.79 138.754 6449.51C134.297 6440.23 135.28 6446.26 128.022 6437.52ZM158.077 6500.87C158.438 6501.63 158.848 6502.42 159.315 6503.26C162.026 6508.11 162.85 6513.63 162.747 6519.09C159.801 6513.81 157.691 6507.92 158.035 6501.76C158.052 6501.45 158.066 6501.16 158.077 6500.87Z"
                fill="#0B172D"
              />
            </g>
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_3773_9894"
            x={-50.9}
            y={-48.9}
            width={215.566}
            height={215.566}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation={7.45}
              result="effect1_foregroundBlur_3773_9894"
            />
          </filter>
          <linearGradient
            id="paint0_linear_3773_9894"
            x1={721}
            y1={0}
            x2={721}
            y2={394}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.485577} stopColor="#09BDFF" />
            <stop offset={0.870192} stopColor="#71D3FF" />
            <stop offset={1} stopColor="#77B2FF" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3773_9894"
            x1={813}
            y1={826.516}
            x2={410}
            y2={826.516}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset={1} stopColor="#DEE2B2" />
          </linearGradient>
          <clipPath id="clip0_3773_9894">
            <rect width={1440} height={6738} fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
