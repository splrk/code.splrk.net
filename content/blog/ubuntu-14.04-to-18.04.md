---
date: "2019-04-11"
title: Upgrading from Ubuntu 14.04 to 18.04
description: "It's time to upgrade that Ubuntu Server from an old LTS to the new
and shiny 18.04.  Here's some tips on How to do it"
tags: ["linux", "server", "ubunutu"]
---

# Upgrading from Ubuntu 14.04 to 18.04

1. Make a backup

```bash
###############################################
# Backup of System Created 20 April 2015 by Waldo Badenhorst

cd /
cd /mnt/Data/systembackup

tar -cpzf backup-`date +%Y-%m-%d-full.tar.bz2` --exclude=/backup-`date +%Y-%m-%d-full.tar.bz2` --exclude=/proc --exclude=/lost+found --exclude=/sys --exclude=/mnt --exclude=/media --exclude=/dev /
```

Backup SQL dbs

```bash
export DB_BACKUP="/mnt/mysqlbackup/mysqlbackup"
export DB_USER="root"
export DB_PASSWD="XXXXXX"


mysqldump --user=$DB_USER --password=$DB_PASSWD --all-databases | bzip2 > $DB_BACKUP/mysql-`date +%Y-%m-%d`.bz2
```

**Do Akeeba backups on Website**


2.  Upgrade packages

```bash
sudo apt update
sudo apt upgrade -y
sudo apt dist-upgrade -y
```

3.  Upgrade to 16.04


If doing this over ssh, you will need to make sure the backup ssh port is 
open

```bash
iptables -I INPUT -p tcp --dport 1022 -j ACCEPT
```


```bash
sudo do-release-upgrade
```

If you can, do this from a console, however if you are on a hosted provider,
you will get a warning.  enter `y` to continue upgrading


### space problems


The upgrade has aborted. The upgrade needs a total of 58,1 M free
space on disk '/boot'. Please free at least an additional 16,9 M of
disk space on '/boot'. You can remove old kernels using 'sudo apt
autoremove' and you could also set COMPRESS=xz in
/etc/initramfs-tools/initramfs.conf to reduce the size of your
initramfs.

**REMOVE OLD KERNELS**


When you get to the `Do you want to start the upgrade?` prompt, first press `d`
to list the details.  Just check through the packages, (especially the Remove 
list) and lookup any red flags.  For instance, you might notice that mysql is
upgrading from 5.5 to 5.7.  You might want to research any gotchas for that
upgrade.  Also, make a note of unsupported packages.  It is probably a good idea
to remove them after the upgrade if you do not need them or have alternatives

```
biosdevname gcc-4.8-base gcc-4.9-base
  libarchive-extract-perl libck-connector0 libdbd-mysql-perl
  liblog-message-simple-perl libmodule-pluggable-perl
  libpod-latex-perl libterm-readkey-perl libterm-ui-perl
  libtext-soundex-perl module-init-tools python-debian w3m
```

biosdevname dialog gcc-4.8-base gcc-4.9-base
  libarchive-extract-perl libjs-jquery-metadata
  libjs-jquery-tablesorter liblog-message-simple-perl
  libmodule-pluggable-perl libpod-latex-perl libterm-ui-perl
  libtext-soundex-perl module-init-tools python-debian python3-mock
  w3m



press `q` when done then press `y` to continue

You will likely get some prompts

### phpmyadmin

servername - if you are running the mysql server on the same host, then this will be `localhost`


#### handling db upgrades manually

Make sure to handle the upgrades manually

backups stored in /var/cache/dbconfig-common/backups


### other

** Should I say yes to restart services during package upgrades without asking  when I am doing this over ssh??**

### Package differences

You might often be asked to view differences in config files

1. Check the diff
2. When in doubt, use package maintaners version


### custom repost

delete all /etc/apt/sources.list.d/*.distUpgrade files

Uncomment out line ins in all /etc/apt/sources.list.d/*.list files that have
a comment about being disabled during upgrade

run

```bash
sudo apt update
```

to resolve errors


### Remove unsupported packages

```bash
sudo apt remove ...
sudo apt autoremvoe
```

### mysql errors / table rebuilds

```bash
mysqldump --all-databases > dump.sql
mysql < dump.sql
```