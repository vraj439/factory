import logging
from logging.config import fileConfig

from alembic import context
from server.app import create_app
from server.models import consumer_user_model

# Import your app factory function
# from your_flask_app import create_app  # Replace with the correct path to your app factory function

# Alembic Config object
config = context.config

# Interpret the config file for Python logging
fileConfig(config.config_file_name)
logger = logging.getLogger("alembic.env")


def get_engine(app):
    try:
        return app.extensions["migrate"].db.get_engine()
    except (TypeError, AttributeError):
        return app.extensions["migrate"].db.engine


def get_engine_url(app):
    try:
        return get_engine(app).url.render_as_string(hide_password=False).replace("%", "%%")
    except AttributeError:
        return str(get_engine(app).url).replace("%", "%%")


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    app = create_app()  # Create Flask app
    with app.app_context():  # Activate application context
        url = get_engine_url(app)
        context.configure(url=url, target_metadata=app.extensions["migrate"].db.metadata, literal_binds=True)

        with context.begin_transaction():
            context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    app = create_app()  # Create Flask app
    with app.app_context():  # Activate application context
        connectable = get_engine(app)

        def process_revision_directives(context, revision, directives):
            if getattr(config.cmd_opts, "autogenerate", False):
                script = directives[0]
                if script.upgrade_ops.is_empty():
                    directives[:] = []
                    logger.info("No changes in schema detected.")

        with connectable.connect() as connection:
            context.configure(
                connection=connection,
                target_metadata=app.extensions["migrate"].db.metadata,
                process_revision_directives=process_revision_directives,
            )

            with context.begin_transaction():
                context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
