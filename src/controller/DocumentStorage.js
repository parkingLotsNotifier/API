let latestDocument = null;

function setLatestDocument(document) {
  latestDocument = document;
}

function getStoredDocument() {
  return latestDocument;
}

module.exports = {
  setLatestDocument,
  getStoredDocument
};
