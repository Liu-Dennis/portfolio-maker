import express from "express";
import { ObjectId } from "mongodb";

// Portfolio post routes, kept in their own file so main.js barely changes.
//
// Ownership rule: the server never trusts the client about who owns what.
//   - Reading a portfolio is public.
//   - Every write uses req.user._id from the session, and every post query is
//     scoped with { owner: req.user._id }, so you can only touch your own posts
//     even with a hand-crafted request.
//   - isOwner is sent to the client only to decide whether to show edit tools.
export default function registerPortfolioRoutes(app, client, ensureAuthenticated) {
    const posts = client.db("portfolio_maker").collection("posts");
    const json = express.json();

    // Public: a user's posts + whether the viewer owns this portfolio
    app.get('/api/portfolio/:uid', async (req, res) => {
        const { uid } = req.params;
        if (!ObjectId.isValid(uid)) {
            return res.status(404).json({ error: "Portfolio not found" });
        }

        const ownerPosts = await posts
            .find({ owner: new ObjectId(uid) })
            .sort({ createdAt: -1 })
            .toArray();

        res.json({ posts: ownerPosts, isOwner: isOwner(req, uid) });
    });

    // Owner only: create a post on your own portfolio
    app.post('/api/posts', ensureAuthenticated, json, async (req, res) => {
        const fields = readPostFields(req.body);
        if (!fields.title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const post = { ...fields, owner: req.user._id, createdAt: new Date() };
        const result = await posts.insertOne(post);
        res.status(201).json({ ...post, _id: result.insertedId });
    });

    // Owner only: edit one of your posts
    app.put('/api/posts/:id', ensureAuthenticated, json, async (req, res) => {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: "Post not found" });
        }
        const fields = readPostFields(req.body);
        if (!fields.title) {
            return res.status(400).json({ error: "Title is required" });
        }

        // owner in the filter = can't edit someone else's post
        const updated = await posts.findOneAndUpdate(
            { _id: new ObjectId(req.params.id), owner: req.user._id },
            { $set: { ...fields, updatedAt: new Date() } },
            { returnDocument: "after" }
        );
        if (!updated) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(updated);
    });

    // Owner only: delete one of your posts
    app.delete('/api/posts/:id', ensureAuthenticated, async (req, res) => {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: "Post not found" });
        }
        const result = await posts.deleteOne({
            _id: new ObjectId(req.params.id),
            owner: req.user._id,
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(204).end();
    });
}

// true if the logged in user owns portfolio `uid`
function isOwner(req, uid) {
    return req.isAuthenticated() && !!req.user?._id && req.user._id.toString() === uid;
}

function cleanString(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

// Only copy allowed fields -- never spread req.body into the DB,
// or a client could overwrite `owner`.
function readPostFields(body = {}) {
    return {
        title: cleanString(body.title, 200),
        description: cleanString(body.description, 5000),
        imageUrl: cleanString(body.imageUrl, 2000),
    };
}
