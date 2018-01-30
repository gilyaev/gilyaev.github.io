================
Branches service
================
----------------------
Developer Instructions
----------------------

Requirements
============

#. Python 3.x, pip, virtualenv
#. Git
#. Django 1.11.x
#. PostgreSQL 9.x

API Documentation
=================

https://conf.fxclub.org/pages/viewpage.action?pageId=68256055


Installation
============

Regular Installation
--------------------

1. Common Part
~~~~~~~~~~~~~~

#. Install ``pip``, ``virtualenv``, ``virtualenvwrapper``::

    $ sudo apt-get install python-virtualenv virtualenvwrapper

#. Configure ``virtualenvwrapper`` (the example below is for ``bash``)::

    $ cat 'export WORKON_HOME=~/.virtualenvs' >> ~/.bash_profile
    $ bash
    $ mkvirtualenv --python=`which python3` branches
    # Stay in 'branches' virtualenv; otherwise, if you ``deactivate`` it, you can activate it again by typing ``workon branches``.

#. Install headers for further Python packages compilation::

    $ sudo apt-get install libpq-dev build-essential python-dev libssl-dev libffi-dev libjpeg-dev

#. Clone the repository and install the dependencies::

    $ git clone git@git.fxclub.org:web/api-branch.git branches
    $ cd branches
    $ pip install -r requirements.txt

#. Create a local settings file and update database connection settings::

    $ cd branches
    $ cp local_settings.example.py local_settings.py
    $ vim local_settings.py

   For a production environment, set ``DEBUG`` to ``False``; for development — to ``True``:

   .. code-block:: python

    DEBUG = True  # For development
    DEBUG = False  # For a production environment

   Update database connection settings:

   .. code-block:: python

    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'database_name_here',
        'USER': 'username_here',
        'PASSWORD': 'password_here',
        'HOST': '127.0.0.1',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',  # Set to empty string for default.
    }

#. Find ``manage.py`` in the project ``app`` directory inside the project root and ensure it is executable::

    $ cd ../..
    $ chmod +x manage.py

#. For a clean installation with an empty database, follow the instructions in `Appendix A: Initial Django Setup`_.

Please proceed with either `2. Development Environment`_ or `3. Production Environment`_ depending on which environment you want to set up.

2. Development Environment
~~~~~~~~~~~~~~~~~~~~~~~~~~
#. Start the development server *(run in the 'app' directory)*::

    $ ./manage.py runserver

    # By default, the server will run on localhost:8000.
    # You can specify other host and port, e.g. to listen on all interfaces, port 8001:
    # ./manage.py runserver 0.0.0.0:8001

   You are done! Open http://localhost:8000/ in a browser and enjoy.

   *You don't have to read any further unless you want to set up a production environment.*

3. Production Environment
~~~~~~~~~~~~~~~~~~~~~~~~~
For a *production environment*, you will need to complete a few more steps: install ``uWSGI`` [1]_ and configure ``Nginx``.

3.1. Setting Up uWSGI
_____________________

#. Install ``uWSGI`` if it isn't yet installed::

    $ sudo apt-get install uwsgi uwsgi-plugin-python3

#. Copy sample config file to the uwsgi config directory *(replace* ``<project_root>`` *with an actual project root path)*::

    $ sudo cp <project_root>/conf/uwsgi/branches.ini /etc/uwsgi/apps-available/

#. Create a symlink in ``apps-enabled``::

    $ sudo ln -s /etc/uwsgi/apps-available/branches.ini /etc/uwsgi/apps-enabled/

#. Update settings marked with ``TODO`` comments in ``/etc/uwsgi/apps-available/branches.ini`` file, e.g.::

    ...
    virtualenv = /home/username/.virtualenvs/branches  # TODO: Specify path to your virtualenv here
    chdir = /home/username/www/branches           # TODO: Specify path to the app dir inside your project dir
    touch-reload = /home/username/www/branches/branches/wsgi.py  # TODO: Update the path to your project dir
    ...

#. Restart ``uWSGI`` server::

    $ sudo service uwsgi restart

3.2. Setting Up Nginx
_____________________

#. Install ``Nginx`` if it isn't yet installed::

    $ sudo apt-get install nginx

#. Copy sample config file to the nginx config directory *(replace* ``<project_root>`` *with an actual project root path)*::

    $ sudo cp <project_root>/conf/nginx/branches /etc/nginx/sites-available/

#. Create a symlink in ``sites-enabled`` directory::

    $ sudo ln -s /etc/nginx/sites-available/branches /etc/nginx/sites-enabled/

#. Update settings marked with ``TODO`` comments in ``/etc/nginx/sites-available/branches`` file, e.g.::

    ...
    # TODO: Update the server name
    server_name branches-dev.web2.dev.fxclub.org;

    # TODO: Update the project path
    set $root /home/username/www/branches/branches;
    ...

#. Reload ``Nginx`` config files::

    $ sudo service nginx reload


At this point, your environment must be fully configured, so go ahead and open in the browser the host name you specified, e.g.: http://branches-test.web2.dev.fxclub.org/ *(adjust the domain name as necessary)*.

Appendix A: Initial Django Setup
--------------------------------

For a clean Django installation (i.e. with an empty database), the following steps are required to make your Django installation fully functional:

#. Apply database migrations [2]_::

    # From the 'app' directory:
    $ ./manage.py migrate

#. If you are running on a new database, create a superuser::

    # From the 'app' directory:
    $ ./manage.py createsuperuser
    # Fill in username, email and password as Django prompts


Appendix B: Deployment with Fabric
----------------------------------

There is a quick way to update a local project copy using ``Fabric`` [3]_.

With the ``virtualenv`` activated, run the following command::

   $ fab local_update:updatesrc

This command performs several actions:

    - Updates local Git repository from the upstream.
    - Collects all static files.
    - Updates Python requirements using ``pip``.
    - Applies migrations.
    - Gracefully reloads the application server (``uWSGI``).

If you don't want to pull changes from Git, just write::

   $ fab local_update

**Note:** If you want to use an external tool for calling ``fab``, be sure to prepend the command with the ``virtualenv`` activation like this::

   $ <virtualenv_path>/bin/activate && fab local_update

where ``<virtualenv_path>`` is the path to the ``virtualenv``.

Notes
---------
.. [1] `uWSGI <https://uwsgi-docs.readthedocs.io/en/latest/>`_ is an application server working with `Web Server Gateway Interface <https://wsgi.readthedocs.io/en/latest/>`_ protocol (or ``WSGI`` for short).

.. [2] Migrations are integrated into Django. See `Django Migrations <https://docs.djangoproject.com/en/1.11/topics/migrations/>`_ for more information.

.. [3] `Fabric <http://www.fabfile.org/>`_ is a tool for streamlining the use of SSH for application deployment or systems administration tasks. We use `Fabric3 <https://pypi.python.org/pypi/Fabric3>`_ — a Python3-compatible port of Fabric.