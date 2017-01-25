"""
Django settings for intranet project.

Generated by 'django-admin startproject' using Django 1.10.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ')$%2!h%pl$3aqv!t=i#1xc1z(i2=18d(k7#yq_n2$v0$6*fda!'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['172.16.2.205', 'localhost','192.168.200.123']

DEPLOY = 'INEI'
# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'pandas',
    'intranetapp',
    'capacitacion',
    'login',
    'reportes',
    'rest_framework',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'intranet.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'intranet.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

if DEPLOY == 'INEI':
    DATABASES = {
        'default': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV_CAPACITACION2',
            'USER': 'us_capacitacion_web',
            'PASSWORD': 'cap5wegU$re',
            'HOST': '172.18.1.41',
            'OPTIONS': {
                'driver': 'SQL Server',
            },
        },
        'segmentacion': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV_SEGMENTACION',
            'USER': 'us_segmentacion_web',
            'PASSWORD': 'u$s3g*mentaWeB',
            'HOST': '172.18.1.41',
            'OPTIONS': {
                'driver': 'SQL Server',
            },
        },
        'consecucion': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'INEI_BDRRHH_CONSECUCION',
            'USER': 'rvila',
            'PASSWORD': 'inei1202',
            'HOST': '192.168.200.250',
            'OPTIONS': {
                'driver': 'SQL Server',
                'unicode_results': True,
            },
        },
    }
elif DEPLOY == 'CASA':
    DATABASES = {
        'default': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV_CAPACITACION',
            'USER': 'sa',
            'PASSWORD': 'luis123',
            'HOST': 'localhost',
            'OPTIONS': {
                'driver': 'SQL Server',
            },
        },
    }
elif DEPLOY == 'PRODUCTION':
    DATABASES = {
        'default': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV_CAPACITACION2',
            'USER': 'us_capacitacion_web',
            'PASSWORD': 'cap5wegU$re',
            'HOST': '172.18.1.41',
            'OPTIONS': {
                'driver': 'ODBC Driver 11 for SQL Server',
                'unicode_results': True
            },
        },
        'segmentacion': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV_SEGMENTACION',
            'USER': 'us_segmentacion_web',
            'PASSWORD': 'u$s3g*mentaWeB',
            'HOST': '172.18.1.41',
            'OPTIONS': {
                'driver': 'ODBC Driver 11 for SQL Server',
                'unicode_results': True
            },
        },
        'consecucion': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'INEI_BDRRHH_CONSECUCION',
            'USER': 'rvila',
            'PASSWORD': 'inei1202',
            'HOST': '192.168.200.250',
            'OPTIONS': {
                'driver': 'ODBC Driver 11 for SQL Server',
                'unicode_results': True
            },
        },
    }
"""
'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    },
"""

# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
CSRF_COOKIE_SECURE = False

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
    )
}
