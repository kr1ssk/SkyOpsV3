import { Link, useParams } from "react-router-dom";
import { publicaciones } from "../data/publicaciones.js";
export default function DetalleBlog() {
  const { id } = useParams();
  const publicacion = publicaciones.find(p => p.id === id);
  return <article>
    <h1>{publicacion ? publicacion.titulo : "Publicación no encontrada"}</h1>
    {publicacion && <p>{publicacion.contenido}</p>}
    <Link to="/blog">Volver al blog</Link>
  </article>;
}
