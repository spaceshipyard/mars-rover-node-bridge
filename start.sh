#!/bin/bash

### BEGIN INIT INFO
# Provides: mars-rover-bridge
# Required-Start: $remote_fs $syslog
# Required-Stop: $remote_fs $syslog
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 6
# Short-Description: mars-rover-bridge
# Description: This file starts and stops mars-rover-bridge process
#
### END INIT INFO

set -x

ABSOLUTE_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
echo $ABSOLUTE_PATH
export basedir=`dirname $ABSOLUTE_PATH`
export dispatcherUrl=${roverDispatcherUrl:="https://mars-rover.org"}
export room=${roverNodeBridgeRoom:="lobby"}
export export statusHandlers="led/led-status-handlers"
pidFile="run.pid"

function install() {
    if git diff-index --quiet HEAD --; then
        # No changes
        echo "git verification has been passed, no local changes"
    else
        # Changes
        echo "local git changes are observed procedure is terminated"
        exit 1
    fi

    git pull --rebase
    npm i
}

function run() {
    cd ${basedir}
    nohup npm run start >> run.log 2>&1 &
    echo $! > ${pidFile}
}

function stop() {
    if [ -f ${pidFile} ]; then
	targetPID=`cat ${pidFile}`
	targetProcessGroup=`ps -o pgid= ${targetPID} | grep -o '[0-9]*'`
        kill -KILL -${targetProcessGroup}
        rm ${pidFile}
    else
        echo "process has not been terminated, no process id file ${pidFile}"
    fi
}

case "$1" in
 start)
  stop
  run
 ;;
 stop)
  stop
 ;;
 restart)
  stop
  run
 ;;
 install)
  install
 ;;
 *)
  echo "Usage: mars-rover-bridge {start|stop|restart|install}" >&2
  exit 3
 ;;

esac



