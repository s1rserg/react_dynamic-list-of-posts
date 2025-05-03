import classNames from 'classnames';
import React, { useState } from 'react';
import { CommentData } from '../types/Comment';
import { addComment } from '../api/comments';
import { Comment } from '../types/Comment';

type Props = {
  postId: number;
  addCommentToList: (comment: Comment) => void;
};

export const NewCommentForm: React.FC<Props> = ({
  postId,
  addCommentToList,
}) => {
  const [authorNameValue, setAuthorNameValue] = useState('');
  const [authorEmailValue, setAuthorEmailValue] = useState('');
  const [commentTextValue, setCommentTextValue] = useState('');
  const [authorNameError, setAuthorNameError] = useState(false);
  const [authorEmailError, setAuthorEmailError] = useState(false);
  const [commentTextError, setCommentTextError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetErrors = () => {
    setAuthorEmailError(false);
    setAuthorNameError(false);
    setCommentTextError(false);
  };

  const handleReset = () => {
    resetErrors();
    setAuthorNameValue('');
    setAuthorEmailValue('');
    setCommentTextValue('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetErrors();

    if (!authorNameValue) {
      setAuthorNameError(true);
    }

    if (!authorEmailValue) {
      setAuthorEmailError(true);
    }

    if (!commentTextValue) {
      setCommentTextError(true);
    }

    if (!commentTextValue || !authorEmailValue || !commentTextValue) {
      return;
    }

    setIsLoading(true);
    async function createComment(comment: CommentData) {
      const newComment = await addComment(comment);

      addCommentToList(newComment);
    }

    try {
      const newComment: CommentData = {
        postId,
        name: authorNameValue,
        email: authorEmailValue,
        body: commentTextValue,
      };

      createComment(newComment);
      setCommentTextValue('');
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      data-cy="NewCommentForm"
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={classNames('input', { 'is-danger': authorNameError })}
            value={authorNameValue}
            onChange={event => setAuthorNameValue(event.target.value)}
            onBlur={() => setAuthorNameError(false)}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {authorNameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {authorNameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={classNames('input', { 'is-danger': authorEmailError })}
            value={authorEmailValue}
            onChange={event => setAuthorEmailValue(event.target.value)}
            onBlur={() => setAuthorEmailError(false)}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {authorEmailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {authorEmailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('textarea', {
              'is-danger': commentTextError,
            })}
            value={commentTextValue}
            onChange={event => setCommentTextValue(event.target.value)}
            onBlur={() => setCommentTextError(false)}
          />
        </div>

        {commentTextError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button is-link', {
              'is-loading': isLoading,
            })}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button type="reset" className="button is-link is-light">
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
