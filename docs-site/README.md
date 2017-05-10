
[//]: # ( Copyright 2017 Turbine Labs, Inc.                                   )
[//]: # ( you may not use this file except in compliance with the License.    )
[//]: # ( You may obtain a copy of the License at                             )
[//]: # (                                                                     )
[//]: # (     http://www.apache.org/licenses/LICENSE-2.0                      )
[//]: # (                                                                     )
[//]: # ( Unless required by applicable law or agreed to in writing, software )
[//]: # ( distributed under the License is distributed on an "AS IS" BASIS,   )
[//]: # ( WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or     )
[//]: # ( implied. See the License for the specific language governing        )
[//]: # ( permissions and limitations under the License.                      )

# Overview

This repository hosts the source files for
https://docs.turbinelabs.io. It is managed as a jekyll site, using
categories to group content. Reference (located in the _reference
directory) contains a linear walk through of concepts, architecture,
all-in-one demo, and installation and configuration. Guides (located
in the _guides directory) are focused, goal oriented articles,
e.g. "get this working on GKE".

Open items include

* where/how to host this

# How to add third-party snippets like Google analytics

* Add the snippet to `assets/vendor.js`. Note that the snippet should be placed
in a jQuery [`ready`](http://api.jquery.com/ready/) function call
`$(function() {<snippet code>})`. Since many third-party snippets are designed
to run in a `script` element at the bottom of the page, you may have to modify
the snippet to call directly any functions that are registered via
`document.addEventListener('load', fn)` or similar.
* Extract the snippet's identifier (if any), e.g., the Google Analytics tracking
id, and replace with an env template, e.g., `{{env "GOOGLE_ANALYTICS_KEY"}}`
* Create a secret for the identifier, e.g.,
    <secrets>/kubernetes/secrets $ make-secret.sh docs-google-analytics
     trackingId <tracking id> > docs-google-analytics.yaml
* Add the secret to Kubernetes, e.g., `kubectl create -f ./docs-google-analytics.yaml`
* Update `<workspace>/developer/docs-site/docker/k8s-docs-site-yaml.tmpl`,
creating an `env` entry for the new secret.

# Getting your rubies set up

Jekyll is built with ruby. There are many ways to install ruby on a
mac. Pick the one that is least infuriating to you. Using homebrew is a
fine answer. You'll also need gems (installed with ruby if you're
using homebrew) and bundler, because how else are you going to gem
up your gems.

```shell
brew install ruby
gem install bundler
```

then verify you have reasonably modern versions

```shell
> ruby -v
ruby 2.4.0p0 (2016-12-24 revision 57164) [x86_64-darwin16]
> bundle -v
Bundler version 1.14.6
```

Now, from within this project directory run

```shell
bundle
```

To make sure your Gems are packaged up correctly for running jekyll

# Building the site

To serve the site for local development, run

`jekyll serve`

Then go to http://localhost:4000

To build the site for distribution run

`jekyll build`

And gizp or whatever all the stuff in _site.

# Site Layout

It's a pretty stock jekyll site, and jekyll has a wealth of
documentation on the web. Instead of using gem based themes I copied
the minima files into the repo. The two special items are a
"categorcombined" layout that smashes all content for a category into
a single page, and a sidebar to navigate content.

## categorycombined

This takes a variable called collection_name from the page, and looks in
the site variable for a matching collection. If the first element in
that collection has a variable called print_order it sorts the
collection, otherwise it takes it in whatever jekyll's natural sort
order is. It then iterates through the collection, skipping any
index.md files (as these are usually the ones with the
categorycombined layout). For each page, it produces an anchor so you
can navigate via the sidebar, includes an h1 title, and then adds page
content. The result is a single page concatenation of docs in a
defined print order.

## sidebar

There are two partials in _include to support the
sidebar. _includes/sidebar_section.html takes a collection as an argument, and
renders a list of links to content in that collection. If the
collection contains an index.md document it is assumed to have a
categorycombxined layout, and links are rendered as anchor targets
within that summary (e.g. quickstart.md renders as
/reference#quickstart). If it doesn't have an index.md, it renders as
a direct link (e.g. in guides, which has no index.md, tbnctl.md would
render as /reference/tbnctl.html).

_includes/sidebar.html renders the entire sidebar, including
sidebar_section.html for guides and reference.

_layouts/default.html was modified from minima's defaults to add the
sidebar.

# Styles

Jekyll supports sass for stylesheets. The main entry point is
assets/main.scss, which in turn loads a theme from
_sass/minima.scss. The minima defaults are very lightly modified,
adding Turbine Labs fonts (Roboto, Lato), a logo in the sidebar,
and our logo grey as the sidebar background.
