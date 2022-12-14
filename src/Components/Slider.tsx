import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { makeImagePath } from "../utils";
import PopUp from "./PopUp";

const Wrapper = styled.div`
  width: 100%;
`;

const Slider = styled.div`
  position: relative;
  display: flex;
`;
const SliderTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 20px;
  padding-inline: 6%;
  font-weight: 700;
  top: 0;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, auto);
  width: 100%;
  position: absolute;
  padding-inline: 6%;
  top: 50px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 1;
`;
const Box = styled(motion.div)`
  background-color: white;
  background-size: cover;
  background-position: center center;
  height: 160px;
  border-radius: 5px;
  font-size: 0;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    margin: 0;
  }
`;

const Info = styled(motion.div)`
  padding: 20px;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
  opacity: 0;
  width: 100%;
  position: absolute;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
    font-weight: 500;
  }
`;

const ButtonArea = styled.div`
  width: 100%;
  padding: 0 2%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 110px;
`;
const Button = styled(motion.button)`
  width: 50px;
  height: 50px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  z-index: 10;
  svg {
    width: 100%;
    height: 100%;
    z-index: 20;
    fill: rgba(255, 255, 255, 1);
  }
`;

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.innerWidth : window.innerWidth,
  }),
  visible: {
    x: 0,
    tranition: {
      duration: 1,
    },
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.innerWidth : -window.innerWidth,
    tranition: {
      duration: 1,
    },
  }),
};

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.3,
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
    },
  },
};

const buttonVar = {
  normal: {
    opacity: 0.5,
  },
  hover: {
    opacity: 1,
  },
};

interface ISliderProps {
  title: string;
  category: string;
  results: any;
  program: string;
}
const offset = 5;

function SliderArea(props: ISliderProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const [category, setCategory] = useState("");
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (programId: number, programCate: string) => {
    navigate(`/${props.program}/${programId}`);
    setCategory(programCate);
  };
  const data = props.results;
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(false);
      const totalPrograms = data.length - 1;
      const maxIndex = Math.floor(totalPrograms / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(true);
      const totalPrograms = data.length - 1;
      const maxIndex = Math.floor(totalPrograms / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  return (
    <Wrapper>
      <Slider>
        <SliderTitle>{props.title}</SliderTitle>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            custom={back}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}>
            {props.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((program: any) => (
                <Box
                  layoutId={program.id + props.category}
                  key={program.id + props.program}
                  variants={BoxVariants}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  onClick={() => onBoxClicked(program.id, props.category)}>
                  <img
                    src={makeImagePath(program.backdrop_path, "w500")}
                    alt={program.title}
                  />
                  <Info variants={infoVariants}>
                    <h4>{program.name || program.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <ButtonArea>
          <Button
            onClick={decreaseIndex}
            variants={buttonVar}
            initial="normal"
            whileHover="hover">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24">
              <path d="M10 20A10 10 0 1 0 0 10a10 10 0 0 0 10 10zm1.289-15.7 1.422 1.4-4.3 4.344 4.289 4.245-1.4 1.422-5.714-5.648z" />
            </svg>
          </Button>
          <Button
            onClick={increaseIndex}
            variants={buttonVar}
            initial="normal"
            whileHover="hover">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24">
              <path d="M10 20A10 10 0 1 0 0 10a10 10 0 0 0 10 10zM8.711 4.3l5.7 5.766L8.7 15.711l-1.4-1.422 4.289-4.242-4.3-4.347z" />
            </svg>
          </Button>
        </ButtonArea>
      </Slider>

      <AnimatePresence>
        <PopUp data={props.results} links={props.program} cate={category} />
      </AnimatePresence>
    </Wrapper>
  );
}

export default SliderArea;
