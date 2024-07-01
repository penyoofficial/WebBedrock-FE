<script setup lang="ts">
import { Request } from "@/apis";
import { systemName } from "@/main";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import type { User } from "@/types/User";
import { ElMessage, type FormInstance } from "element-plus";
import { ref } from "vue";

const form = ref<FormInstance>();

const user = ref({
  loginName: "",
  password: "",
} as User);

const isLoginFirst = ref(true);

const passwordRepeat = ref("");

async function handleSubmit() {
  if (form.value)
    await form.value.validate((v) => {
      if (v) {
        if (isLoginFirst.value) handleLogin();
        else handleRegister();
      } else
        ElMessage({
          message: "登录名或密码无效",
          type: "error",
        });
    });
}

async function handleRegister() {
  const resp = await Request.User.register(
    user.value.loginName,
    user.value.password,
  );
  if (resp.ok) {
    ElMessage({
      message: resp.msg,
      type: "success",
    });
  }
  handleLogin();
}

async function handleLogin() {
  const resp = await Request.User.login(
    user.value.loginName,
    user.value.password,
  );
  if (resp.ok) {
    ElMessage({
      message: resp.msg,
      type: "success",
    });
    useUserStore().token = resp.data;
    router.push("/home");
  } else {
    if (resp.code == 404) {
      ElMessage({
        message: "您正在注册一个新账户，请再次输入密码",
        type: "info",
      });
      isLoginFirst.value = false;
    } else {
      ElMessage({
        message: resp.msg,
        type: "error",
      });
    }
  }
}
</script>

<template>
  <div class="view-h">
    <div class="view-v">
      <el-form
        ref="form"
        class="form g-shadow"
        label-width="auto"
        :model="{
          loginName: user.loginName,
          password: user.password,
          passwordRepeat: passwordRepeat,
        }"
        :rules="{
          loginName: [
            { required: true, message: '登录名不得为空', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '密码不得为空', trigger: 'blur' },
            {
              min: 8,
              max: 16,
              message: '密码长度应该在 8 到 16 位之间',
              trigger: 'blur',
            },
          ],
          passwordRepeat: [
            {
              validator: (_: any, value: string) => {
                if (!isLoginFirst && value != user.password) return false;
                return true;
              },
              message: '两次密码输入不一致',
              trigger: 'blur',
            },
          ],
        }"
      >
        <el-form-item>
          <el-text class="text">
            <h2>登陆您的 {{ systemName }} 账户</h2>
            <p>以访问所有服务</p>
          </el-text>
        </el-form-item>

        <el-form-item prop="loginName">
          <el-input
            class="unit"
            size="large"
            placeholder="请输入登录名"
            v-model="user.loginName"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="unit"
            size="large"
            placeholder="请输入密码"
            v-model="user.password"
            show-password
          />
        </el-form-item>
        <el-form-item v-if="!isLoginFirst" prop="passwordRepeat">
          <el-input
            class="unit"
            size="large"
            placeholder="请再次输入密码"
            v-model="passwordRepeat"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button class="unit" type="primary" @click="handleSubmit"
            >注册{{ isLoginFirst ? "或登录" : "" }}</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-text class="text">
            <p>继续操作则表示，您同意我们的服务条款和隐私声明。</p>
          </el-text>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <el-watermark class="mark" :content="systemName" />
</template>

<style scoped>
.view-h {
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #fbfbfe;

  & .view-v {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.form {
  width: 25rem;
  height: 27rem;
  padding: 2.25rem 2rem 3rem;
  border-radius: 0.75rem;
  background-color: #fff;

  & .text {
    width: 100%;
    text-align: center;
    user-select: none;
  }

  & .unit {
    width: 100%;
    height: 3.2rem;
    font-size: 1rem;
  }
}

.mark {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
