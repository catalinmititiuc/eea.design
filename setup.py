""" Installer
"""
from os.path import join
import os
from setuptools import setup, find_packages

name = 'eea.design'
path = name.split('.') + ['version.txt']
version = open(join(*path)).read().strip()

setup(name=name,
      version=version,
      description="Plone4 theme for EEA",
      long_description=open("README.md").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        ],
      keywords='eea design plone zope',
      author="European Environment Agency",
      author_email='webadmin@eea.europa.eu',
      url='http://svn.eionet.europa.eu/projects/Zope',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['eea'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'Products.EEAContentTypes',
          'Products.EEAPloneAdmin',
          'Products.LinguaPlone',
          'Products.NavigationManager',
          'Products.eeawebapplication',

          'eea.cache',
          'eea.converter',
          'eea.facetednavigation < 10.0',
          'eea.icons',
          'eea.promotion',
          'eea.themecentre',
          'eea.translations',
          'eea.versions',

          'setuptools',
          'valentine.linguaflow',


          # -*- Extra requirements: -*-
          'plone.app.async'
      ],
      entry_points="""
      # -*- Entry points: -*-

      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
