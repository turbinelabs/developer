## Demo exercises

{% if include.platform %}
Now that you're up and running with Houston on {{ include.platform }}, let's walk
through some product use cases.
{% endif %}

### What's going on here?

{% if include.all_in_one %}
With the all-in-one container running, you should be able to navigate to
[localhost](http://localhost/) to view the all-in-one client. (On older versions
of Docker for Mac, and on Windows < 10, you'll access the result of invoking
`docker-machine ip` (with a standard value of `192.168.99.100`) rather than
`localhost`)
{% endif %}

The all-in-one client/server provide a UI and a set of services that help
visualize changes in the mapping of user requests to backend services. This lets
you visualize the impact of Houston on a real deployment without having to
involve real customer traffic or load generators.

The application is composed of three sets of blocks, each simulating a user
making a request. These are simple users, and they all repeat the same request
forever. The services they call return a color. When a user receives a response
it paints the box that color, then waits a random amount of time to make another
request. While it’s waiting the colors in the box fade. Users are organized into
rows based on URL.

<img height="50%" width="50%" src="https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/684824296811398630/85fd3f987358bbbf866ace1ac6193f07fb5788a4302291a8e29c3eef7ac8c973/column_sized_Screen_Shot_2017-01-26_at_9.40.43_PM.png"/>

{% if include.all_in_one %}
The colors indicate the following:

- Blue: a production service
- Green: another production service
- Yellow: a dev service
{% endif %}

You should see pulsating blue boxes for each service, to indicate the initial
state of your production services.
