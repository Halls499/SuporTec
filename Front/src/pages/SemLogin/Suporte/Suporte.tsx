import "./Suporte.css";
import {motion} from "framer-motion";

function Suporte() {
  return (
    <motion.main
      className="contact"
      initial={{opacity: 0.7}}
      animate={{opacity: 1}}
      transition={{duration: 0.5}}
    >

      <motion.h1
        initial={{opacity: 0.6, y: -30}}
        animate={{opacity: 1, y:0}}
        transition={{duration: 0.5}}
      >
        Qualquer dúvida, entre em contato pelas redes sociais:
      </motion.h1>

      <div className="social-links">

        <motion.a
          href="https://instagram.com/halls.raulzito"
          className="link"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0.8, y: 30 }}
          animate={{ opacity: 1, y: 0}}
          transition={{ duration: 0.4}}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          exit={{opacity: 1, y: 0}}
        >
          <i className="fa-brands fa-instagram fa-2x"></i>
          <span>Instagram</span>
        </motion.a>


        <motion.a
          href="https://github.com/Halls499"
          className="link"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0.8, y: 30 }}
          animate={{ opacity: 1, y: 0}}
          transition={{ duration: 0.4}}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          exit={{opacity: 1, y: 0}}
        >
          <i className="fa-brands fa-github fa-2x"></i>
          <span>GitHub</span>
        </motion.a>

      </div>

    </motion.main>
  );
}

export default Suporte;