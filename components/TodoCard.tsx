import { Card, Switch, Typography } from "antd";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { motion, Variants } from "framer-motion";
import React, { CSSProperties, FunctionComponent } from "react";
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

const variants: Variants = {
  initial: { scale: 0 },
  animate: { scale: 1, transition: { type: "spring", stiffness: 100 } },
  exit: { opacity: 0 },
};

const TodoCard: FunctionComponent<Props> = ({ id, todo: { title, note, completed, createdAt, updatedAt } }) => {
  const toggleCompleted = async () => {
    try {
      updateDoc(doc(db, "todos", id), {
        completed: !completed,
      });
    } catch (error) {
      console.log("Error trying to complete todo: ", error);
    }
  };

  const destroy = async () => {
    try {
      deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.log("Error trying to remove todo: ", error);
    }
  };

  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={variants}
      layout
      style={styles.cardContainer}
      whileHover={{ scale: 1.05 }}>
      <Card
        title={<Title completed={completed} title={title} toggleCompleted={toggleCompleted} />}
        bordered={false}
        style={{ ...styles.card, opacity: completed ? 0.6 : 1 }}>
        <Typography>{note}</Typography>
        <Typography style={{ opacity: 0.6, textAlign: "right", marginTop: "1rem" }}>
          {updatedAt.toDate().toISOString()}
        </Typography>
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
