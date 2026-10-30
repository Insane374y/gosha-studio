#!/bin/bash
# job: name video_js cues video_stream voice atempo(1|0) music dur_source out
set -e
# пути считаются от папки репозитория — скрипт можно запускать откуда угодно
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; S="$ROOT/sfx"
run() {
  local name=$1 js=$2 cues=$3 vid=$4 voice=$5 tempo=$6 music=$7 durf=$8 out=$9
  local D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$durf")
  python3 $S/mix.py "$js" "$cues" "$S/out/sfx_$name.wav" "$D" > /dev/null
  python3 $S/duck.py "$S/out/sfx_$name.wav" "$voice" "$tempo" > /dev/null
  local VF="[1:a]anull[v]"; [ "$tempo" = "1" ] && VF="[1:a]atempo=1.1[v]"
  local FO=$(python3 -c "print(max(0,$D-1.5))")
  ffmpeg -y -loglevel error -i "$vid" -i "$voice" -stream_loop -1 -i "$music" -i "$S/out/sfx_$name.wav" \
    -filter_complex "$VF;[2:a]volume=0.11,afade=t=in:d=0.7,afade=t=out:st=$FO:d=1.5[m];[3:a]volume=0.65[s];[v][m][s]amix=inputs=3:duration=first:normalize=0,apad,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 44100 -t "$D" "$out"
  echo "$name $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out")"
}
mkdir -p $S/out $S/final
C=$S/cues; F=$S/final
L="$ROOT/life"; B="$ROOT/batch"; M="$ROOT/fly-short"
run fly $M/render/shots.js $C/fly.py $M/out/gosha_muha_raw.mp4 $M/public/voice.mp3 0 $M/public/music.wav $M/out/gosha_muha.mp4 $F/01_muha.mp4
for p in "01_chameleon:02_hameleon" "02_bat:03_letuchaya_mysh" "03_sun:04_solntse" "04_dreams:05_sny" "05_ant:06_muravey" "06_earth:07_zemlya"; do n=${p%%:*}; o=${p##*:}
  run sci_$n $B/render/v_$n.js $C/sci_$n.py $B/out/_${n}_v.mp4 $B/voice/$n.mp3 1 $B/voice/music.wav $B/out/gosha_$n.mp4 $F/$o.mp4; done
for p in "01_parents:08_roditeli" "02_job:09_rabota" "03_abroad:10_zagranitsa" "04_dorm:11_obshaga" "05_confess:12_priznanie"; do n=${p%%:*}; o=${p##*:}
  run life_$n $L/render/v_$n.js $C/life_$n.py $L/out/_${n}_v.mp4 $L/voice/$n.mp3 1 $L/voice/music.wav $L/out/$n.mp4 $F/$o.mp4; done
