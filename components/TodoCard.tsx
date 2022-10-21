import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Card, Popconfirm, Switch, Typography } from "antd";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { motion, useIsPresent, Variants } from "framer-motion";
import React, { CSSProperties, FunctionComponent, useState } from "react";
import db from "../lib/firebase";
import { Todo } from "../lib/types";

type Props = {
  id: string;
  todo: Todo;
};

const styles: { [key: string]: CSSProperties | { [key: string]: CSSProperties } } = {
  cardContainer: {
    // width: "100%",
    borderRadius: "5px",
  },
  card: {
    backgroundColor: "#ffffff",
  },
};

const TodoCard: FunctionComponent<Props> = ({ id, todo: { title, note, completed, createdAt, updatedAt } }) => {
  const [isHovered, setIsHovered] = useState(false);

  const toggleCompleted = async () => {
    try {
      await updateDoc(doc(db, "todos", id), {
        completed: !completed,
      });
    } catch (error) {
      console.log("Error trying to complete todo: ", error);
    }
  };

  const destroy = async () => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.log("Error trying to remove todo: ", error);
    }
  };

  const variants: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { delay: isHovered ? 0 : 0.3 },
    },
    exit: { opacity: 0, scale: 0 },
  };

  return (
    <motion.div
      // drag
      // dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      initial='initial'
      animate='animate'
      exit='exit'
      variants={variants}
      layout
      style={styles.cardContainer}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}>
      <style jsx>{`
        .deleteIconContainer {
          font-size: 1.1rem;
          opacity: 0.6;
          aspect-ratio: 1/1;
          padding: 0 0.2rem;
          transition: all 0.1s ease;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.9rem;
          border: none;
          background-color: transparent;
        }

        .deleteIconContainer:hover {
          color: red;
          cursor: pointer;
          background-color: #00000011;
          opacity: 1;
        }
      `}</style>
      <Card
        title={<Title completed={completed} title={title} toggleCompleted={toggleCompleted} />}
        bordered={false}
        style={{ ...styles.card, opacity: completed ? 0.6 : 1 }}>
        <Typography>{note}</Typography>
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography style={{ opacity: 0.6, textAlign: "right", display: "inline" }}>
            {updatedAt?.toDate().toISOString()}
          </Typography>
          <Popconfirm
            title='Are you sure to delete this todo?'
            onConfirm={() => setTimeout(destroy, 200)}
            okText='Yes'
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            cancelText='No'>
            <button className='deleteIconContainer'>
              <DeleteOutlined className='' />
            </button>
          </Popconfirm>
        </div>
      </Card>
    </motion.div>
  );
};

const Title: FunctionComponent<any> = ({ completed, toggleCompleted, title }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Typography style={{ display: "inline", marginRight: "auto" }}>{title}</Typography>
      <Switch
        checked={completed}
        onChange={toggleCompleted}
        style={{ backgroundColor: completed ? "#ff7979" : "#bfbfbf" }}
      />
    </div>
  );
};

export default TodoCard;
