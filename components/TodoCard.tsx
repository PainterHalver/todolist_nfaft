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

const styles: { [key: string]: CSSProperties } = {
  cardContainer: {
    width: "100%",
    borderRadius: "5px",
    backgroundColor: "#ffffffaa",
  },
  card: {},
};

const variants: Variants = {
  initial: { scale: 0 },
  animate: { scale: 1, transition: { delay: 0.3, type: "spring", stiffness: 100 } },
  exit: { opacity: 0, transition: { delay: 0.3 } },
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
    <motion.div variants={variants} layout style={styles.cardContainer}>
      <Card
        title={<Title completed={completed} title={title} toggleCompleted={toggleCompleted} />}
        bordered={false}
        style={styles.card}>
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
      <Switch checked={completed} onChange={toggleCompleted} />
    </div>
  );
};

export default TodoCard;
