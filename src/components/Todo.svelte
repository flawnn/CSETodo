<script>
  import "$root/styles/todos.css";
</script>

<main>
  <h1 class="title">to-dos 🚧</h1>

  <div class="todos">
    <form>
      <input type="checkbox" id="toggle-all" class="toggle-all" />
      <label aria-label="Mark all as complete" for="toggle-all">
        Mark all as complete
      </label>

      <input
        id="new-todo"
        class="new-todo"
        placeholder="What's on your mind?"
        type="text"
      />
    </form>

    <ul class="todo-list">
      <li class="todo">
        <div class="todo-item">
          <div>
            <input id="todo" class="toggle" type="checkbox" />
            <label aria-label="Check todo" class="todo-check" for="todo" />
          </div>
          <span class="todo-text">Test Todo</span>
          <button aria-label="Remove todo" class="remove" />
        </div>
      </li>
    </ul>

    <div class="actions">
      <span class="todo-count">0 left</span>
      <div class="filters">
        <button class="filter">All</button>
        <button class="filter">Active</button>
        <button class="filter">Completed</button>
      </div>
      <button class="clear-completed">Clear completed</button>
    </div>
  </div>
</main>
