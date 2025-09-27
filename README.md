## ��װ
```
go get github.com/gin-gonic/gin
go get gorm.io/gorm
go get gorm.io/driver/sqlite
```

## Apifox �ӿڲ�������
- �� `backend` Ŀ¼ִ�� `go run main.go` ��������Ĭ�ϼ��� `http://127.0.0.1:8080`��
- Apifox ��Ŀ������ַ����Ϊ `http://127.0.0.1:8080`��·��ͳһʹ�� `/api/...`��

### ���� 1���������� (POST /api/posts)
- Ŀ�ģ���֤���¿��Գɹ��������������� ID��
- ����ͷ��`Content-Type: application/json`
- ������
```json
{
  "title": "��һƪ����",
  "content": "��ã�Mini Blog"
}
```
- �������ԣ�
  - ״̬�� `200`��
  - `title` ���� `"��һƪ����"`��`content` ���� `"��ã�Mini Blog"`��
  - `id` �ֶδ�����Ϊ���֡�
- ���ýű�ʾ�������� `postId` ����������ʹ�ã���
```javascript
const body = pm.response.json();
pm.expect(body.id).to.be.a("number");
Apifox.setVariable("postId", body.id);
```

### ���� 2����ȡ�������� (GET /api/posts/{{postId}})
- ǰ����������ִ�С��������¡���������� `postId`��
- �������ԣ�
  - ״̬�� `200`��
  - `id` ���� `{{postId}}`��
  - `title`��`content` �ֶβ�Ϊ�ա�
- �ű�����ʾ����
```javascript
const body = pm.response.json();
pm.expect(body.id).to.eql(Number(pm.variables.get("postId")));
pm.expect(body.title).to.be.a("string").and.not.empty;
pm.expect(body.content).to.be.a("string").and.not.empty;
```

### ���� 3���������� (PUT /api/posts/{{postId}})
- ����ͷ��`Content-Type: application/json`
- ������
```json
{
  "title": "���º�ı���",
  "content": "���º������"
}
```
- �������ԣ�
  - ״̬�� `200`��
  - ���ض����� `title`��`content` �����¡�
  - `updatedAt` ʱ��������仯��
- �ű�����ʾ����
```javascript
const body = pm.response.json();
pm.expect(body.title).to.eql("���º�ı���");
pm.expect(body.content).to.eql("���º������");
```

### ���� 4����ȡ�����б� (GET /api/posts)
- �������ԣ�
  - ״̬�� `200`��
  - ��ӦΪ���������ٰ���һ�����ݡ�
- �ű�����ʾ����
```javascript
const body = pm.response.json();
pm.expect(Array.isArray(body)).to.be.true;
pm.expect(body.length).to.be.at.least(1);
```

### ���� 5��ɾ������ (DELETE /api/posts/{{postId}})
- �������ԣ�
  - ״̬�� `200`��
  - ��Ӧ JSON �� `{"message": "Post deleted"}`��
- ���ò�����ɾ���ɹ�����ٴε��á���ȡ�������顱��Ԥ�ڷ��� `404` �� `{"error": "Post not found"}`������֤ɾ����Ч��
