import subprocess
from datetime import datetime
from pathlib import Path


EXTENSIONS = {".tsx", ".ts", ".json", ".html"}
IGNORE_DIRS = {
    "node_modules",
    ".git",
    "build",
}


def success(message: str) -> None:
    print(f"\033[92m{message}\033[0m")


def info(message: str) -> None:
    print(f"\033[96m{message}\033[0m")


def warn(message: str) -> None:
    print(f"\033[93m{message}\033[0m")


def prompt(label: str, transform=None) -> str:
    value = ""
    while not value:
        value = input(label).strip()
        if transform:
            value = transform(value)
    return value


def iter_target_files(root: Path) -> list:
    files = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in IGNORE_DIRS for part in path.parts):
            continue
        if path.suffix not in EXTENSIONS:
            continue
        files.append(path)
    return files


def replace_in_file(path: Path, replacements: list) -> bool:
    original = path.read_text(encoding="utf-8")

    updated = original
    for cur, sub in replacements:
        updated = updated.replace(cur, sub)

    if updated == original:
        return False

    path.write_text(updated, encoding="utf-8")
    return True


def replace_strings(files: list, replacements: list) -> None:
    changed = 0
    for file in files:
        if replace_in_file(file, replacements):
            changed += 1
    success(f"Autoreplaced strings in {changed} file(s)!")


def replace_readme(project_name: str, description: str) -> None:
    Path("README.md").write_text(
        f"# {project_name}\n\n{description}\n", encoding="utf-8"
    )


def npm_install() -> None:
    print("Installing npm dependencies...")
    subprocess.run(["npm", "install"], check=True)
    subprocess.run(
        ["npm", "install", "@adamjanicki/ui@latest"],
        stdout=subprocess.DEVNULL,
        check=True,
    )
    success("Installed npm dependencies!")


def self_delete(script_path: Path) -> None:
    script_path.unlink()
    success("Finished setting up!")


def main() -> None:
    root = Path(".").resolve()
    script_path = Path(__file__).resolve()

    repo_name = prompt(
        "What is the name of your repository?\n(e.g. react-skeleton)\n>>> ",
        transform=lambda s: s.replace(" ", "-").lower(),
    )

    project_name = prompt(
        "What is the name of your project?\n(e.g. React Skeleton)\n>>> "
    )

    description = prompt("What is the description of your project?\n>>> ")

    gh_username = input(
        "What is your GitHub username? (leave blank if Adam)\n>>> "
    ).strip()

    replacements = [
        ("Site built from React skeleton", description),
        ("react-skeleton", repo_name),
        ("React Skeleton", project_name),
        ("2023", f"{datetime.now().year}"),
    ]

    if gh_username:
        replacements.append(
            (': "https://adamjanicki.xyz', f': "https://{gh_username}.github.io')
        )

    print(f"Setting up {project_name}...")

    replace_readme(project_name, description)

    files = iter_target_files(root)
    replace_strings(files, replacements)

    npm_install()

    print("Cleaning up...")
    self_delete(script_path)

    info("Run `npm start` to start the development server")


if __name__ == "__main__":
    main()
