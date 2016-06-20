#test: {title:"Star Wars Rebels After Show"}

table "movies" do
	column "idmovies", :key
	column "idmovies", :integer
	column "title", :string
	column "year", :integer
	column "number", :integer
	column "type", :integer
	column "location", :string
	column "language", :string
end

table "aka_titles", :embed_in => :movies, :on => :idmovies  do
	column "idaka_titles", :key
	column "idmovies", :integer, :references => :movies
	column "title", :string
	column "location", :string
	column "year", :integer
end

# GENRES
table "genres" do
	column "idgenres", :key
	column "genre", :string
end

table "movies_genres", :embed_in => :movies, :on => :idmovies  do
	column "idmovies_genres", :key
	column "idmovies", :integer, :references => :movies
	column "idgenres", :integer, :references => :genres
	column "idseries", :integer
end



# KEYWORDS

table "keywords" do
	column "idkeywords", :key
	column "keyword", :string
end

table "movies_keywords", :embed_in => :movies, :on => :idmovies  do
	column "idmovies_keywords", :key
	column "idmovies", :integer, :references => :movies
	column "idkeywords", :integer, :references => :keywords
	column "idseries", :integer
end

table "series" do
	column "idseries", :key
	column "idmovies", :integer, :references => :movies
	column "name", :string
	column "season", :integer
	column "number", :integer
end

table "actors" do
	column "idactors", :key
	column "idactors", :integer
	column "lname", :string
	column "fname", :string
	column "mname", :string
	column "gender", :integer
	column "number", :integer
end

table "aka_names", :embed_in => :actors, :on => :idactors  do
	column "idaka_names", :key
	column "idactors", :integer, :references => :actors
	column "name", :string
end

table "acted_in" do
	column "idacted_in", :key
	column "idmovies", :integer, :references => :movies
	column "idseries"
	column "idactors", :integer, :references => :actors
	column "character", :string
	column "billing_position", :integer
end