# Contribution Guide

開発にあたり、コミットスタイルを統一ための指針です。

# コードの追加・修正

以下の手順を原則とします。

1. ブランチの作成
1. PullRequestの作成
1. レビュー
1. マージ

## ブランチの作成

- ブランチ名は、`feat-`で始まるようにしてください。
- devブランチからチェックアウトして作成してください。
- 作業を完了したら、リモートリポジトリに同名のブランチを作成してpushしてください。
- コンフリクトを避けるため、極力`git rebase dev`でrebaseしてからpushしてください。
- devブランチを直接編集しないでください。
- 詳細は [dev_info.md](https://github.com/sunfish256/nakajimap/blob/main/docs/develop_info.md) の [Git Flow](https://github.com/sunfish256/nakajimap/blob/main/docs/develop_info.md#git-flow) の項目を参照してください。

## Pull-Requestの作成

- [Pull request] タブからプルリクエストを作成してください。
- ターゲット：dev、ソース：作業ブランチ名、を選択してください。mainブランチをターゲットにしないでください。
- レビュワーが理解できる適切なタイトルをつけてください。
- [PULL_REQUEST_TEMPLATE.md](https://github.com/sunfish256/nakajimap/blob/main/.github/pull_request_template.md) が自動で読み込まれるのでフォーマットに準拠してください。
- mergeする際に作業ブランチは削除されます。削除を希望しない場合は明記してください。
- PR作成後、変更タブにて差分コードへの説明コメント挿入を推奨しています。
- レビュワー（管理者）へレビュー依頼を行ってください。

## レビュー

- 変更タブにて各行へのコメントを挿入してください。コメントには下記ラベルを付与してください。
- レビューが完了したら、全体コメントを記載してください。
  - 承認する場合は、LGTM (Looks Good To Me) と記載してください。
  - 承認しない場合は、理由を記載してプルリクエストを閉じてください。
  - 各行へのコメント一覧（1行目のみでOK）を箇条書きで記載してください。
- 詳細は [dev_info.md](https://github.com/sunfish256/nakajimap/blob/main/docs/develop_info.md) の [コードレビュー](https://github.com/sunfish256/nakajimap/blob/main/docs/develop_info.md#%E3%82%B3%E3%83%BC%E3%83%89%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC) の項目を参照してください。

| ラベル | 意味                            | 意図                                                               |
|--------|---------------------------------|--------------------------------------------------------------------|
| Q      | 質問 (Question)                 | 質問。相手は回答が必要。                                           |
| FYI    | 参考まで (For your information) | 参考までに共有。アクションは不要。                                 |
| NITS   | あら捜し (Nitpick)              | 重箱の隅をつつく提案。無視しても良い。                             |
| IMO    | 提案 (In my opinion)            | 個人的な見解や、軽微な提案。タスク化や修正を検討。                 |
| NR     | お手すきで (No rush)            | 将来的には解決したい提案。タスク化や修正を検討。                   |
| REC    | 推奨 (Recommend)                | 早めの修整を推奨するが、必須ではない。タスク化や修正を検討。       |
| MUST   | 必須 (Must)                     | これを直さないと承認できない。致命的なバグやセキュリティ関連など。 |

## マージ

- [Create a merge commit] (`git merge --no-ff <ブランチ名>`と同義) でマージします。
- 作業ブランチを削除します。main <- dev へのマージである場合は、削除せずに残します。
