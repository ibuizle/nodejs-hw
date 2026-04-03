import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search = '' } = req.query;

  const filter = {
    userId: req.user._id,
  };

  if (tag) {
    filter.tag = tag;
  }

  if (search !== '') {
    filter.$text = { $search: search };
  }

  const skip = (Number(page) - 1) * Number(perPage);

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    Note.find(filter).skip(skip).limit(Number(perPage)),
  ]);

  const totalPages = Math.ceil(totalNotes / Number(perPage));

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found note with id ${noteId}!`,
    data: note,
  });
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a note!',
    data: note,
  });
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully deleted note!',
    data: note,
  });
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const updatedNote = await Note.findOneAndUpdate(
    {
      _id: noteId,
      userId: req.user._id,
    },
    req.body,
    {
      returnDocument: 'after',
    },
  );

  if (!updatedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated note!',
    data: updatedNote,
  });
};