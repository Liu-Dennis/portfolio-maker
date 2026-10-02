import { Card, Button } from 'react-bootstrap';
import "./editTools.css";

// Grid of the artist's posts. `editable` only controls whether Edit/Delete render.
function PostGrid({ posts, editable, emptyMessage, onEdit, onDelete }) {
    if (posts.length === 0) {
        return <p className="text-muted mb-0">{emptyMessage}</p>;
    }

    return (
        <div className="postGrid">
            {posts.map(post => (
                <Card key={post._id}>
                    {post.imageUrl && (
                        <Card.Img variant="top" src={post.imageUrl} alt={post.title} className="postCardImg" />
                    )}
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        {post.description && <Card.Text>{post.description}</Card.Text>}
                    </Card.Body>
                    {editable && (
                        <Card.Footer className="d-flex gap-2">
                            <Button size="sm" variant="outline-primary" onClick={() => onEdit(post)}>Edit</Button>
                            <Button size="sm" variant="outline-danger" onClick={() => onDelete(post)}>Delete</Button>
                        </Card.Footer>
                    )}
                </Card>
            ))}
        </div>
    );
}
export default PostGrid;
