#!/usr/bin/env bash
# Run this from inside the root folder of this git repo
chown -R bitnami:daemon ../
setfacl -Rdm g::rwx ../
find ../ -not- path "./.git" -not -path "./.git/*" -not -path "./node_modules" -not -path "./node_modules/*" -type d -exec chmod u=rwx,g=rwxs,o=rx {} \;
find ../ -not -path "./.git" -not -path "./.git/*" -not -path "./node_modules" -not -path "./node_modules/*" -type f -exec chmod u=rw,g=rw,o=r {} \;