// 疑似AI - アバター返答生成（ルールベース）
import type { BrushLog, AvatarReply, WeekStats } from '../types';

export const generateAvatarReply = (
  log: BrushLog,
  streak: number,
  stats: WeekStats,
  recentLogs: BrushLog[]
): AvatarReply => {
  const praise: string[] = [];
  let tip = '';
  let nextCommitment = '';
  let closing = '';
  let adviseVisit = false;

  // === 褒める (3点) ===
  
  // 1. 連続日数を褒める
  if (streak === 0) {
    praise.push('歯みがきを記録できましたね！素晴らしいスタートです✨');
  } else if (streak === 1) {
    praise.push('2日連続！この調子で続けていきましょう🎉');
  } else if (streak === 3) {
    praise.push('3日連続達成！習慣化の第一歩ですね👏');
  } else if (streak === 7) {
    praise.push('🎊1週間連続達成！素晴らしい継続力です！');
  } else if (streak === 14) {
    praise.push('🏆2週間連続！もう立派な習慣になっていますね！');
  } else if (streak === 30) {
    praise.push('🌟30日連続達成！あなたは歯みがきマスターです！');
  } else if (streak > 30) {
    praise.push(`驚異の${streak}日連続！歯みがきの習慣が完全に身についていますね✨`);
  } else {
    praise.push(`${streak}日連続！毎日の積み重ねが素晴らしいです👍`);
  }

  // 2. 今回のログを褒める
  if (log.durationSec >= 120) {
    praise.push('2分以上しっかり磨けました！丁寧なケアですね🦷');
  } else if (log.durationSec >= 90) {
    praise.push('1分半以上磨けました！良いペースです😊');
  } else {
    praise.push('歯みがきできましたね！記録することが大切です📝');
  }

  // 3. 評価や時間帯を褒める
  if (log.selfRating >= 4) {
    praise.push('自己評価が高いですね！気持ちよく磨けた証拠です✨');
  } else if (log.timeOfDay === 'morning') {
    praise.push('朝の歯みがき、気持ちいいスタートですね☀️');
  } else if (log.timeOfDay === 'night') {
    praise.push('夜の歯みがき、良い睡眠につながりますね🌙');
  } else {
    praise.push('タイミングを見つけて磨けましたね！');
  }

  // === 改善提案 (1つ) ===
  
  // 症状があれば優先的にアドバイス
  if (log.bleeding) {
    tip = '出血があったようですね。力を入れすぎず、歯ぐきを優しくマッサージするように磨いてみましょう。';
    adviseVisit = true;
  } else if (log.pain) {
    tip = '痛みがあるとのこと。ブラシの圧を弱めて、痛む部分は特に優しく磨きましょう。';
    adviseVisit = true;
  } else if (log.sensitivity) {
    tip = 'しみる感覚があったんですね。知覚過敏用の歯磨き粉や、やわらかめのブラシを試してみるのも良いかもしれません。';
  } else {
    // 最近のログから傾向を分析
    const shortBrushingCount = recentLogs.filter(l => l.durationSec < 120).length;
    const avgRecentDuration = recentLogs.length > 0
      ? recentLogs.reduce((sum, l) => sum + l.durationSec, 0) / recentLogs.length
      : 0;

    if (shortBrushingCount >= 3 && log.durationSec < 120) {
      tip = '2分未満の歯みがきが続いていますね。まずは「前歯だけ丁寧に」など、一部に集中して2分を目指してみませんか？';
    } else if (avgRecentDuration >= 120 && log.durationSec < 90) {
      tip = '今回は少し短めでしたね。忙しい時でも、できる範囲で大丈夫です。次回はもう少しゆっくり磨いてみましょう。';
    } else if (log.durationSec >= 180) {
      tip = '3分以上磨いたんですね！力の入れすぎに注意して、歯ぐきにも優しく接してあげてください。';
    } else if (stats.morningNightCoverage < 50) {
      tip = '朝晩両方磨けると理想的です。まずは夜だけでも習慣にしてみましょう。';
    } else {
      tip = 'この調子で続けていきましょう。歯の裏側や奥歯も忘れずに磨いてくださいね。';
    }
  }

  // === 次の約束 ===
  const todayHasMorning = recentLogs.some(l => {
    const today = new Date().toISOString().split('T')[0];
    return l.dateISO.startsWith(today) && l.timeOfDay === 'morning';
  });
  const todayHasNight = recentLogs.some(l => {
    const today = new Date().toISOString().split('T')[0];
    return l.dateISO.startsWith(today) && l.timeOfDay === 'night';
  });

  if (!todayHasMorning && log.timeOfDay === 'night') {
    nextCommitment = '明日の朝も忘れずに磨きましょう！';
  } else if (!todayHasNight && log.timeOfDay === 'morning') {
    nextCommitment = '今夜も磨いて、1日2回を目指しましょう！';
  } else if (log.durationSec < 120) {
    nextCommitment = '次回は2分を目標に、ゆっくり磨いてみましょう。';
  } else {
    nextCommitment = '明日も今日のように続けていきましょう！';
  }

  // === 励まし ===
  if (adviseVisit) {
    closing = '症状が続く場合は、無理せず歯科医院を受診してくださいね。あなたの健康を応援しています💚';
  } else if (streak >= 7) {
    closing = 'あなたの継続力は素晴らしいです！一緒に健康な歯を守っていきましょう😊';
  } else if (log.selfRating >= 4) {
    closing = '気持ちよく磨けたようで嬉しいです！この調子で楽しく続けましょう🎵';
  } else {
    closing = '毎日少しずつでも大丈夫。あなたのペースで続けていきましょう💪';
  }

  return {
    praise,
    tip,
    nextCommitment,
    closing,
    flags: { adviseVisit },
  };
};
