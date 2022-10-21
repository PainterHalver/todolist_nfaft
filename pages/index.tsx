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
import { AnimateSharedLayout, motion, Variants } from "framer-motion";
import { CSSProperties, FormEvent, FunctionComponent, useEffect, useState } from "react";
import TodoCard from "../components/TodoCard";
import db from "../lib/firebase";

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: "1200px",
    width: "100%",

    // minHeight: "80vh",
    height: "100%",
    padding: "1rem 1rem",
    // backgroundColor: "cyan",
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

  return (
    <motion.div variants={containerVariants} transition={{ type: "linear" }} style={styles.container}>
      <div style={styles.wrapper}>
        {todos.map((todo) => (
          <TodoCard todo={todo.data()} id={todo.id} key={todo.id} />
        ))}
      </div>
    </motion.div>
  );
};

export default Home;
