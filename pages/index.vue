<template>
  <div class="container">
    <h2>Todos postgre</h2>

    <ul v-if="todos">
      <li class="well" v-for="(todo, k) in todos" :key="k">
        <div class="row">
          <div class="col-8">
            <h4>{{todo.name}}</h4>

            <p>{{todo.ingredients}}</p>
          </div>

          <div class="col-4">
            <button class="btn btn-sm btn-danger" @click="delMe(todo)">Delete</button>
               <button class="btn btn-sm btn-info" @click="editMe(todo)">Edit</button>
          </div>
        </div>
      </li>
    </ul>
    <!-- 
    <div>
      <button class="btn btn-danger btn-block" @click="getTodos">getTodos</button>
    </div>-->

    <b-button v-b-modal.modaltodos>Tambah todos</b-button>

    <b-modal id="modaltodos" ref="modaltodos" title="add todos">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" v-model="input.name" />
      </div>
      <div class="form-group">
        <label for="name">Ingredients</label>
        <input type="text" class="form-control" v-model="input.ingredients" />
      </div>
      <div class="form-group">
        <label for="name">Directions</label>
        <input type="text" class="form-control" v-model="input.directions" />
      </div>

      <div>
        <button class="btn btn-primary btn-block" @click="addTodos">Save</button>
      </div>
    </b-modal>

        <b-modal id="modaltodosEdit" ref="modaltodosEdit" title="UPDATE todos">
<p>{{inputEdit.id}}</p>

      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" v-model="inputEdit.name" />
      </div>
      <div class="form-group">
        <label for="name">Ingredients</label>
        <input type="text" class="form-control" v-model="inputEdit.ingredients" />
      </div>
      <div class="form-group">
        <label for="name">Directions</label>
        <input type="text" class="form-control" v-model="inputEdit.directions" />
      </div>

      <div>
        <button class="btn btn-primary btn-block" @click="updateTodos">UPDATE</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "sample",
  data() {
    return {
      todos: [],
      input: {
        name: "",
        directions: "",
        ingredients: ""
      },
      inputEdit: {
        name: "",
        directions: "",
        ingredients: ""
      }
    };
  },
  methods: {
    getTodos() {
      const vm = this;
      // getTodos
      try {
        vm.$store
          .dispatch("getTodos")
          .then(res => {
            vm.todos = res.data.data.rows;
            console.log("todos res ", res);
          })
          .catch(e => {
            console.log("error ", e);
          });
      } catch (error) {
        console.log("catch error", error);
      }
    },
    addTodos() {
      const vm = this;
      const formData = new FormData();
      formData.append("name", vm.input.name);
      formData.append("ingredients", vm.input.ingredients);
      formData.append("directions", vm.input.directions);

      try {
        vm.$store
          .dispatch("saveTodos", formData)
          .then(res => {
            console.log("todos res ", res);

            vm.input = {
              name: "",
              ingredients: "",
              directions: ""
            };
            vm.$refs.modaltodos.hide();
            vm.getTodos();
          })
          .catch(e => {
            console.log("error ", e);
          });
      } catch (error) {
        console.log("catch error", error);
      }
    },
    delMe(todos) {
      console.log("todos ", todos);
      const vm = this;
      const formData = new FormData();
      formData.append("id", todos.id);

      try {
        vm.$store
          .dispatch("delTodos", formData)
          .then(res => {
            console.log("todos res delete success ", res);
            vm.getTodos();
          })
          .catch(e => {
            console.log("error ", e);
          });
      } catch (error) {
        console.log("catch error", error);
      }
    },
    updateTodos() {
      const vm = this;
      const formData = new FormData();
      formData.append("id", vm.inputEdit.id);
      formData.append("name", vm.inputEdit.name);
      formData.append("ingredients", vm.inputEdit.ingredients);
      formData.append("directions", vm.inputEdit.directions);

      try {
        vm.$store
          .dispatch("updateTodos", formData)
          .then(res => {
            console.log("todos res UPDATE success ", res);
            vm.$refs.modaltodosEdit.hide();
            vm.getTodos();
          })
          .catch(e => {
            console.log("error ", e);
          });
      } catch (error) {
        console.log("catch error", error);
      }
    },
    editMe(todos) {
      const vm = this
      vm.inputEdit = {
        id: todos.id,
        name: todos.name,
        ingredients: todos.ingredients,
        directions: todos.directions
      }
      vm.$refs.modaltodosEdit.show();
    }
  },
  mounted() {
    this.getTodos();
  }
};
</script>

<style>
</style>