Cantrip
=======

A codename generator for Node

Install from GitHub::

    npm install thomaswilburn/cantrip -g

Then run with the ``cantrip`` command. You can specify words of speech in order to get more varied results::

    $ cantrip adj noun adv verb
    idle-platoon-badly-infuse

You can also use the ``--times`` option to run multiple iterations of the query. Cantrip defaults to ``adj noun`` as its phrase seed.

If you want to use Cantrip from another module, require it and then call its ``generate`` function::

    var cantrip = require("cantrip");
    var result = cantrip.generate(["adv", "verb"]);

Based on databases from the `WordNet project <http://wordnet.princeton.edu>`__.
