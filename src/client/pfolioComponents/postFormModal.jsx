import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import "./editTools.css";

const EMPTY = { title: "", description: "", imageUrl: "" };

// Shared create/edit form. Pass `post` to edit, null to create.
function PostFormModal({ show, post, onHide, onSave }) {
    const [fields, setFields] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // reset the form every time it opens
    useEffect(() => {
        if (show) {
            setFields(post
                ? { title: post.title ?? "", description: post.description ?? "", imageUrl: post.imageUrl ?? "" }
                : EMPTY);
            setError(null);
        }
    }, [show, post]);

    const update = (key) => (e) => setFields(f => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await onSave(fields);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{post ? "Edit post" : "New post"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="post-title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control required maxLength={200} value={fields.title} onChange={update("title")} autoFocus />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="post-image">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control type="url" placeholder="https://..." value={fields.imageUrl} onChange={update("imageUrl")} />
                    </Form.Group>
                    {fields.imageUrl && (
                        <img src={fields.imageUrl} alt="Preview" className="postFormPreview mb-3" />
                    )}
                    <Form.Group controlId="post-description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={4} maxLength={5000} value={fields.description} onChange={update("description")} />
                    </Form.Group>
                    {error && <Alert variant="danger" className="mt-3 mb-0">{error}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={saving}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? "Saving..." : post ? "Save changes" : "Create post"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
export default PostFormModal;
