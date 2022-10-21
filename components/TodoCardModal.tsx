import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Card, Popconfirm, Switch, Typography } from "antd";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { CSSProperties, FunctionComponent } from "react";
import db from "../lib/firebase";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectCurrentTodo, selectCurrentTodoId, registerCurrentTodo } from "../redux/todoSlice";

const styles: { [key: string]: CSSProperties | { [key: string]: CSSProperties } } = {
  modalContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  overlay: {
    zIndex: 1,
    position: "fixed",
    background: "rgba(0, 0, 0, 0.2)",
    willChange: "opacity",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  cardContainer: {
    width: "100%",
    borderRadius: "5px",
    maxWidth: "700px",
    zIndex: 2,
  },
  card: {
    backgroundColor: "#ffffff",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

const TodoCard: FunctionComponent = () => {
  const router = useRouter();
  const { title, note, completed, updatedAt } = useAppSelector(selectCurrentTodo);
  const id = useAppSelector(selectCurrentTodoId);
  const dispatch = useAppDispatch();

  const toggleCompleted = async () => {
    try {
      dispatch(registerCurrentTodo({ id, todo: { title, note, completed: !completed, updatedAt } }));
      await updateDoc(doc(db, "todos", id), {
        completed: !completed,
      });
    } catch (error) {
      console.log("Error trying to complete todo: ", error);
    }
  };

  const destroy = async () => {
    try {
      backToHome();
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.log("Error trying to remove todo: ", error);
    }
  };

  const backToHome = () => {
    router.push("/");
  };

  return (
    <div style={styles.modalContainer}>
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        style={styles.overlay}
        onClick={backToHome}></motion.div>
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        layoutId={`card-container-${id}`}
        style={styles.cardContainer}>
        <Card
          title={<Title completed={completed} title={title} id={id} toggleCompleted={toggleCompleted} />}
          bordered={false}
          style={{ ...styles.card, opacity: completed ? 0.6 : 1 }}>
          <motion.div layoutId={`card-note-${id}`}>
            <Typography>{note}</Typography>
          </motion.div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <motion.div layoutId={`card-updatedAt-${id}`}>
              <Typography style={{ opacity: 0.6, textAlign: "right", display: "inline" }}>
                {updatedAt?.toDate().toISOString()}
              </Typography>
            </motion.div>
            <motion.div layoutId={`card-deleteIcon-${id}`}>
              <Popconfirm
                title='Are you sure to delete this todo?'
                onConfirm={() => setTimeout(destroy, 200)}
                okText='Yes'
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                cancelText='No'>
                <button className='deleteIconContainer' onClick={(e) => e.stopPropagation()}>
                  <DeleteOutlined className='' />
                </button>
              </Popconfirm>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const Title: FunctionComponent<any> = ({ completed, toggleCompleted, title, id }) => {
  return (
    <motion.div layoutId={`card-title-${id}`} style={{ display: "flex", alignItems: "center" }}>
      <motion.div layoutId={`card-title-text-${id}`} style={{ marginRight: "auto" }}>
        <Typography style={{ whiteSpace: "break-spaces" }}>{title}</Typography>
      </motion.div>
      <motion.div layoutId={`card-switch-${id}`} onClick={(e) => e.stopPropagation()}>
        <Switch
          checked={completed}
          onChange={toggleCompleted}
          style={{ backgroundColor: completed ? "#ff7979" : "#bfbfbf" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default TodoCard;
