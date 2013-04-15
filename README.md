Prototyping an async snippet for persona.

Two runnable examples: one that is sync, the other async.

Note, assertion verification has to happen on the server. To keep things simple, using a trivial node verifier for both sync and async pages.

Things to do to install this bidness:
* add personaexample.com to /etc/hosts:

    127.0.0.1        personaexample.com

* npm install
* npm start

Visit ```personaexample.com/sync``` for the synchronous version suggested by the current docs, and ```personaexample.com/async``` for the prototype async version.
