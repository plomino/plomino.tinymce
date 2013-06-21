from setuptools import setup, find_packages
import os

version = '0.7.3'

setup(name='plomino.tinymce',
      version=version,
      description="TinyMCE Plomino Embedded Plugin",
      long_description=open("README.rst").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # Get more strings from
      # http://pypi.python.org/pypi?%3Aaction=list_classifiers
      classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        ],
      keywords='',
      author='Romaric BREIL',
      author_email='romaric.breil@supinfo.com',
      url='http://pypi.python.org/pypi/plomino.tinymce',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['plomino'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          # -*- Extra requirements: -*-
          'Products.TinyMCE >= 1.2.13',
      ],
      entry_points="""
      # -*- Entry points: -*-

      [z3c.autoinclude.plugin]
      target = plone
      """
      )
