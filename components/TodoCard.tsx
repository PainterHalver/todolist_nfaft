import { CSSProperties, FunctionComponent, useState } from "react";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Card, Popconfirm, Switch, Typography } from "antd";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/router";

import db from "../lib/firebase";
import { TodoFirestoreType } from "../lib/types";
import { useAppDispatch } from "../redux/store";
import { registerCurrentTodo } from "../redux/todoSlice";

const styles: { [key: string]: CSSProperties } = {
  cardContainer: {
    borderRadius: "5px",
  },
  card: {
    backgroundColor: "#ffffff",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

type TodoCardProps = {
  id: string;
  todo: TodoFirestoreType;
};

const TodoCard: FunctionComponent<TodoCardProps> = ({ id, todo: { title, note, completed, createdAt, updatedAt } }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  const handleClick = () => {
    dispatch(
      registerCurrentTodo({
        id,
        todo: {
          title,
          note,
          completed,
          createdAt: createdAt.toDate().toISOString(),
          updatedAt: updatedAt.toDate().toISOString(),
        },
      })
    );
    router.push(`#${id}`);
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
    <div>
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
        // drag
        // dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        initial='initial'
        animate='animate'
        exit='exit'
        variants={variants}
        layoutId={`card-container-${id}`}
        style={styles.cardContainer}
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}>
        <Card
          title={<Title completed={completed} title={title} id={id} toggleCompleted={toggleCompleted} />}
          bordered={false}
          style={{ ...styles.card, opacity: completed ? 0.6 : 1 }}>
          <motion.div layoutId={`card-note-${id}`}>
            <Typography>
              {note.length > 380 ? note.slice(0, 380).split(" ").slice(0, -1).join(" ") + "..." : note}
            </Typography>
          </motion.div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <motion.div layoutId={`card-updatedAt-${id}`}>
              <Typography style={{ opacity: 0.6, textAlign: "right", display: "inline" }}>
                {updatedAt?.toDate().toISOString()}
              </Typography>
            </motion.div>
            <motion.div>
              <Popconfirm
                title='Are you sure to delete this todo?'
                onConfirm={(e) => {
                  e?.stopPropagation();
                  setTimeout(destroy, 200);
                }}
                onCancel={(e) => e?.stopPropagation()}
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
  const truncatedTitle = title.length > 100 ? title.slice(0, 100).split(" ").slice(0, -1).join(" ") + "..." : title;

  return (
    <motion.div layoutId={`card-title-${id}`} style={{ display: "flex", alignItems: "center" }}>
      <motion.div layoutId={`card-title-text-${id}`} style={{ marginRight: "auto" }}>
        <div style={{ whiteSpace: "break-spaces" }}>{truncatedTitle}</div>
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
