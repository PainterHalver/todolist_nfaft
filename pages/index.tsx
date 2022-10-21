import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { AnimatePresence, AnimateSharedLayout, motion, Variants } from "framer-motion";
import { CSSProperties, FormEvent, FunctionComponent, useEffect, useRef, useState } from "react";
import TodoCard from "../components/TodoCard";
import AddTodoForm from "../components/AddTodoForm";
import db from "../lib/firebase";
import { Button } from "antd";

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: "1200px",
    width: "100%",
    alignSelf: "start",

    height: "100%",
    padding: "1rem 1rem",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  addTodoContainer: {
    backgroundColor: "white",
    color: "black",
    marginBottom: "1.5rem",
    width: "60%",
    minWidth: "450px",
    borderRadius: "3px",
    padding: ".5rem .7rem",
    fontSize: "1rem",
    fontWeight: 400,
    letterSpacing: "0.00938em",

    height: "-1px", // don't know why this is needed, but it is

    display: "flex",
    flexDirection: "column",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.5rem",
    // backgroundColor: "red",
  },
};

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
  exit: { opacity: 0 },
};

const Home: FunctionComponent = () => {
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const addTodoTitle = useRef<HTMLTextAreaElement>(null);
  const [todos, setTodos] = useState<DocumentData[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "todos"), orderBy("completed", "asc"), orderBy("updatedAt", "desc")),
      (snapshot) => setTodos(snapshot.docs),
      (error) => console.log(error)
    );

    // Cleanup
    return () => unsubscribe();
  }, [db]);

  const addTodo = async (e: FormEvent) => {
    e.preventDefault();

    const { title, note } = e.target as typeof e.target & {
      title: { value: string };
      note: { value: string };
    };
    try {
      const docRef: DocumentReference = await addDoc(collection(db, "todos"), {
        title: title.value,
        note: note.value,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.log("Error trying to add todo: ", error);
    }
  };

  const resizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = "1px";
    element.style.height = element.scrollHeight + "px";
  };

  const cancelForm = () => {
    addTodoTitle.current!.value = "";
    resizeTextarea(addTodoTitle.current!);
    setIsAddTodoOpen(false);
  };

  return (
    <motion.div variants={containerVariants} transition={{ type: "linear" }} style={styles.container}>
      <motion.form
        animate='animate'
        variants={{
          animate: { height: "auto" },
        }}
        layout
        key='add-todo'
        style={styles.addTodoContainer}
        whileHover={{ boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.2)", cursor: "text" }}>
        <motion.textarea
          layout
          placeholder={isAddTodoOpen ? "Title" : "Add a todo..."}
          onClick={() => setIsAddTodoOpen(true)}
          style={{
            fontSize: "1.1rem",
            border: "none",
            fontWeight: isAddTodoOpen ? 500 : 400,
            resize: "none",
            padding: ".4rem 0",
          }}
          onChange={(e) => resizeTextarea(e.target)}
          ref={addTodoTitle}></motion.textarea>
        {isAddTodoOpen && (
          <>
            <textarea
              name='note'
              placeholder='Add a note...'
              style={{ border: "none", marginTop: "0.7rem", resize: "none" }}
              onChange={(e) => resizeTextarea(e.target)}
            />
            <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
              <Button onClick={cancelForm}>Cancel</Button>
              <Button type='primary' onClick={addTodo} style={{ marginLeft: "1rem" }}>
                Add
              </Button>
            </div>
          </>
        )}
      </motion.form>
      <div style={styles.wrapper}>
        {todos.map((todo) => (
          <TodoCard todo={todo.data()} id={todo.id} key={todo.id} />
        ))}
      </div>
    </motion.div>
  );
};

export default Home;
