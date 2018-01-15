allihoopa.js Release Procedure
==============================

While [Travis] is responsible for actually deploying a tagged release to NPM,
there are some manual preparations that need to be done first:

1. Decide on which version number to update to. We use [Semantic Versioning],
   which in short means that if you've introduced a breaking change, you *must*
   bump the major version. If it contains new features, it should be a minor
   update. If it's a bug fix release, it should be a patch update.
2. Update the version number in the following files: `README.md`,
   `package.json`.
3. Update the `CHANGELOG.md` with the release notes for the new release. Try to
   summarize the changes and fixes that went in to the release, don't just dump
   a list of commits there. Also, make sure that you've added/updated the link
   to the GitHub tag comparison page at the bottom of the document. You can look
   at the diff of the changelog to see how this has been done before.
4. Commit these changes with a message like "Release version X.Y.Z"
5. Wait for Travis to okay the build.
6. Add the tag vX.Y.Z to the commit and push the tag.
7. Wait for Travis to finish the build.
8. You're done!


[Travis]: https://travis-ci.org/allihoopa/allihoopa.js
[Semantic Versioning]: http://semver.org
