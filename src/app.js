const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

var repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(400).json({ message: "Repository not found." });
  }
  const updatedRepository = {
    id: repository.id,
    title,
    url,
    techs,
    likes: repository.likes,
  };

  repositories = repositories.map((repository) => {
    if (repository.id === id) {
      return updatedRepository;
    } else {
      return repository;
    }
  });

  return response.status(200).json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "Repository not found." });
  }
  repositories.splice(repositoryIndex, 1);

  return response
    .status(204)
    .json({ message: "repository has been successfully deleted" });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryAddLike = repositories.find(
    (repository) => repository.id === id
  );

  if (!repositoryAddLike) {
    return response.status(400).json({ message: "Repository not found." });
  }
  repositoryAddLike.likes++;

  repositories = repositories.map((repository) => {
    if (repository.id === id) {
      return repositoryAddLike;
    } else {
      return repository;
    }
  });

  return response.status(200).json(repositoryAddLike);
});

module.exports = app;
